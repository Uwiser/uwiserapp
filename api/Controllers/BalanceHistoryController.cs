using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Constantes;
using uwiserApi.IRepository;
using uwiserApi.Model;
using uwiserApi.Repository;
using uwiserApi.Services;
using Voximplant.API;

namespace uwiserApi.Controllers
{
    [ApiController]
    [Route("api/uwiser/BalanceHistory")]
    public class BalanceHistoryController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ICallRepository _icallRepository;
        private readonly IBalanceHistoryRepository _ibalanceHistoryController;
        private readonly IPaymentHistoryRepository _ipaymentHistoryController;
        private VoximplantAPI _voximplantAPI;

        public BalanceHistoryController(IUserRepository userRepository, ICallRepository icallRepository, IPaymentHistoryRepository ipaymentHistoryController, IBalanceHistoryRepository ibalanceHistoryController)
        {
            _userRepository = userRepository;
            _icallRepository = icallRepository;
            _ibalanceHistoryController = ibalanceHistoryController;
            _ipaymentHistoryController = ipaymentHistoryController;
            var pathCompleto = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location).ToString(), "resources" + Path.DirectorySeparatorChar + "key-vox.json");
            var config = new ClientConfiguration
            {
                KeyFile = pathCompleto
            };
            //   var api = new VoximplantAPI(config);
            this._voximplantAPI = new VoximplantAPI(config);

        }

        [HttpGet("user/{idUser:int}")]
        [Authorize]
        [Produces(typeof(BalanceHistory))]
        public async Task<IActionResult> GetAllUser(int idUser)
        {
            var lista = await _ibalanceHistoryController.GetAllUser(idUser);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("interpreter/{idInterpreter:int}")]
        [Authorize]
        [Produces(typeof(BalanceHistory))]
        public async Task<IActionResult> GetAllInterpreter(int idInterpreter)
        {
            var lista = await _ibalanceHistoryController.GetAllInterpreter(idInterpreter);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("all")]
        [Authorize]
        [Produces(typeof(BalanceHistory))]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _ibalanceHistoryController.GetAll();

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpPost]
        [Authorize]
        // [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Add([FromBody] BalanceHistory obj)
        {
            var rows = await _ibalanceHistoryController.Add(obj);

            if (rows == 0)
            {
                return NoContent();
            }
            else
            {
                var rows2 = await _userRepository.AddBalance(obj.interpreter_id, obj.seconds);
                var rows3 = await _userRepository.RemoveCredits(obj.user_id, obj.seconds);

                if (rows2 == 0 || rows3 == 0)
                {
                    return NoContent();
                }

                return Ok(rows2);
            }
        }

        [HttpPut("RemoveBalance")]
        [Authorize]
        // [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> RemoveBalance(BalanceHistory obj)
        {
            var rows = await _userRepository.RemoveBalance(obj.interpreter_id, obj.seconds);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }
    }
}
