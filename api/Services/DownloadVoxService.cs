using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using log4net;
using Model.Constantes;
using Model.Timer;
using Newtonsoft.Json;
using uwiserApi.IRepository;
using uwiserApi.Model;
using uwiserApi.Repository;
using Voximplant.API;

namespace Services
{
    public class DownloadVoxService
    {
        private readonly ILog _log = log4net.LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);
        private int INTERVALO_TIMER = 120;
        private long ULTIMO_ID_PROCESSADO = 0;
        private bool EXEC = false;
        private readonly IUserRepository _userRepository;
        private readonly ICallRepository _icallRepository;
        private VoximplantAPI _voximplantAPI;

        public DownloadVoxService(IUserRepository userRepository, ICallRepository icallRepository)
        {
            _userRepository = userRepository;
            _icallRepository = icallRepository;

            var pathCompleto = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location).ToString(), "resources" + Path.DirectorySeparatorChar + "key-vox.json");
            var config = new ClientConfiguration
            {
                KeyFile = pathCompleto
            };
            this._voximplantAPI = new VoximplantAPI(config);
        }

        public void IniciaTimer()
        {
            var timer = new TimerAsync<TimerDTO>("DOWNLOAD_CALLS", new TimerDTO(INTERVALO_TIMER));
            timer.timer = new System.Threading.Timer(Timeout, timer, 5 * 1000, INTERVALO_TIMER * 1000);
        }

        private void Timeout(Object state)
        {
            var timer = state as TimerAsync<TimerDTO>;
            try
            {
                if (Monitor.TryEnter(timer._threadLock))
                {
                    // var _downloadVoxService = _serviceProvider.GetRequiredService<DownloadVoxService>();
                    _log.Info("Iniciando execucao do timer"); // log.Error(ex, ex
                    try
                    {
                        if (!EXEC)
                        {
                            EXEC = true;
                            DownloadsCallHistory();
                        }
                    }
                    catch (Exception ex)
                    {
                        _log.Error("Erro  ao baixar dados VOX", ex); // log.Error(ex, ex);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro " + ex); // log.Error(ex, ex);
            }
            finally
            {
                if (Monitor.IsEntered(timer._threadLock))
                {
                    Monitor.Exit(timer._threadLock);
                }
                UpdateTimer(timer);
            }
        }

        private void UpdateTimer(TimerAsync<TimerDTO> timer)
        {
            try
            {
                timer.timer.Change(INTERVALO_TIMER * 1000, INTERVALO_TIMER * 1000);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro " + ex); // log.Error(ex, ex);
            }
        }

        public async void DownloadsCallHistory()
        {
            try
            {
                var dataInicio = DateTime.Now.AddDays(-60);
                var dataFim = DateTime.Now.AddDays(10);
                var result = await _voximplantAPI.GetCallHistory(
                  dataInicio,
                  dataFim,
                    applicationId: Constantes.APPLICATION_VOX_ID,
                      count: 10000L,
                     withCalls: true,
                     offset: 1,
                 withRecords: true
                );
                var qtd = result.Result.Length;
                _log.InfoFormat("Resultado: {0} com total de {1} registros", result, qtd);

                var lista = result.Result;
                var lista2 = lista.OrderByDescending(item => item.CallSessionHistoryId).ToList();
                var tasks = new List<Task<long>>();

                foreach (var voxCall in lista2)
                {
                    await TratarVoxCall(voxCall);
                }

                _log.Info($"Response: {result.Result.ToString()}");
            }
            catch (Exception e)
            {
                _log.Error("Erro na execucao do timer", e);
            }

            _log.Info($"FINALIZOU EXECUCAO TIMER");
            EXEC = false;
        }
        private async Task<long> TratarVoxCall(Voximplant.API.Response.CallSessionInfoType voxCall)
        {
            if (voxCall.Calls == null)
            {
                return 0;
            }

            if (voxCall.Calls.Length == 2)
            {
                var callSend = voxCall.Calls[0];
                _log.InfoFormat("Verificando voxSend: {0} -> '{1}'", callSend.LocalNumber, JsonConvert.SerializeObject(callSend));
                var callSendDB = new CallHistory
                {
                    CallId = callSend.CallId,
                    Cost = callSend.Cost.HasValue ? callSend.Cost.Value : 0,
                    CustomData = voxCall.CustomData,
                    Duration = voxCall.Duration.HasValue ? voxCall.Duration.Value : 0,
                    LocalNumber = callSend.LocalNumber,
                    RemoteNumber = callSend.RemoteNumber,
                    RemoteNumberType = callSend.RemoteNumberType,
                    StartTime = callSend.StartTime,
                    UrlFile = voxCall.LogFileUrl,
                    Type = "S"
                };

                var callReceived = voxCall.Calls[1];
                _log.InfoFormat("Verificando voxReceived: {0} -> '{1}'", callReceived.LocalNumber, JsonConvert.SerializeObject(callReceived));
                var callReceivedBD = new CallHistory
                {
                    CallId = callReceived.CallId,
                    Cost = callReceived.Cost.HasValue ? callReceived.Cost.Value : 0,
                    CustomData = voxCall.CustomData,
                    Duration = voxCall.Duration.HasValue ? voxCall.Duration.Value : 0,
                    LocalNumber = callReceived.LocalNumber,
                    RemoteNumber = callReceived.RemoteNumber,
                    RemoteNumberType = callReceived.RemoteNumberType,
                    StartTime = callReceived.StartTime,
                    UrlFile = voxCall.LogFileUrl,
                    Type = "R"
                };
                var userSend = await _userRepository.GetByUserName(callSendDB.LocalNumber);
                var userReceived = await _userRepository.GetByUserName(callReceivedBD.LocalNumber);

                callSendDB.OtherUserId = userReceived != null ? userReceived.id : 0;
                callSendDB.OtherDisplayName = userReceived != null ? userReceived.name : null;
                callReceivedBD.OtherUserId = userSend != null ? userSend.id : 0;
                callReceivedBD.OtherDisplayName = userSend != null ? userSend.name : null;

                await TrataCallSend(voxCall, callSendDB, userSend);
                await TrataCallReceived(voxCall, callReceivedBD, userReceived);
            }
            return 1;
        }

        private async Task TrataCallSend(Voximplant.API.Response.CallSessionInfoType voxCall, CallHistory callSendDB, UserUwiser userSend)
        {
            _log.Info($"Validando callSend {callSendDB.CallId} para inserção!");
            var callSend = voxCall.Calls[0];

            var callSendExists = await _icallRepository.ExisteCallByID(callSend.CallId);
            if (callSendExists == 0)
            {
                if (userSend != null)
                {
                    callSendDB.UserId = userSend.id;
                    callSendDB.DisplayName = userSend.name;
                    var rows = await _icallRepository.Add(callSendDB);
                    if (rows > 0)
                    {
                        _log.Info($"CALL Send {callSendDB.CallId} inserida com sucesso");
                    }
                    else
                    {
                        _log.Info($"CALL Send nao foi inserida  {callSendDB.CallId} ");
                    }
                }
                else
                {
                    _log.Info($"Usuario com username {callSendDB.LocalNumber} não encontrado!");
                }
            }
            else
            {

            }
        }

        private async Task TrataCallReceived(Voximplant.API.Response.CallSessionInfoType voxCall, CallHistory callReceivedBD, UserUwiser userReceived)
        {
            _log.Info("Validando callreceived para inserção!");

            var callReceived = voxCall.Calls[1];
            var callReceivedExists = await _icallRepository.ExisteCallByID(callReceived.CallId);

            if (callReceivedExists == 0)
            {
                if (userReceived != null)
                {
                    callReceivedBD.UserId = userReceived.id;
                    callReceivedBD.DisplayName = userReceived.name;
                    var rows = await _icallRepository.Add(callReceivedBD);
                    if (rows > 0)
                    {
                        _log.Info($"CALL Received {callReceivedBD.CallId} inserida com sucesso");
                    }
                    else
                    {
                        _log.Info($"CALL  Received nao foi inserida  {callReceivedBD.CallId} ");
                    }
                }
                else
                {
                    _log.Info($"Usuario com username {callReceivedBD.LocalNumber} não encontrado!");
                }
            }
        }
    }
}