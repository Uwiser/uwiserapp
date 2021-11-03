using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using uwiserApi.Model;
using MySql.Data.MySqlClient;
using Dapper;
using Dapper.Contrib.Extensions;
using Newtonsoft.Json;
using uwiserApi.IRepository;

namespace uwiserApi.Repository
{
    public class CallRepository : ICallRepository
    {
        private readonly IConfiguration _configuration;

        public CallRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public async Task<CallHistory> Get(long idUser)
        {
            var sql = "SELECT * FROM call_history u  WHERE u.UserId = @id ORDER BY u.StartTime DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<CallHistory>
                (
                    sql, new { id = idUser }
                );

                return result.AsList()[0];
            }
        }

        public async Task<IEnumerable<CallHistory>> GetCallReceived(long idUser)
        {
            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var sql = "SELECT * FROM call_history u  WHERE u.UserId = @id and u.Type = 'R'  ORDER BY u.StartTime DESC";
                return await connection.QueryAsync<CallHistory>(sql, new { id = idUser });

            }
        }
        public async Task<IEnumerable<CallHistory>> GetCallSended(long idUser)
        {

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var sql = "SELECT * FROM call_history u  WHERE u.UserId = @id and u.type = 'S'  ORDER BY u.StartTime DESC";
                return await connection.QueryAsync<CallHistory>(sql, new { id = idUser });
            }
        }
        public async Task<IEnumerable<CallHistory>> GetAll(long idUser)
        {
            var sql = "SELECT * FROM call_history u  WHERE u.UserId = " + idUser + "  ORDER BY u.StartTime DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<CallHistory>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<CallHistory>> GetAll()
        {
            var sql = "SELECT * FROM call_history u WHERE u.type = 'R' ORDER BY u.StartTime DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<CallHistory>
                (
                    sql
                );
            }
        }

        public async Task<CallHistory> GetCallByID(long idCall)
        {
            var sql = "SELECT * FROM call_history u  WHERE u.CallId = @id  ORDER BY u.StartTime DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryFirstOrDefaultAsync<CallHistory>(sql, new { idCall = idCall });

                // return result;
            }
        }

        public async Task<long> ExisteCallByID(long idCall)
        {
            var sql = "SELECT count(1) FROM call_history u  WHERE u.CallId = @idCall  ORDER BY u.StartTime DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteScalarAsync<long>(sql, new { idCall = idCall });

                // return result;
            }
        }


        public Task<long> Add(CallHistory entity)
        {
            try
            {
                Console.WriteLine("INSERINDO CALLLL" + JsonConvert.SerializeObject(entity));
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity.Id = connection.Insert(entity);
                    return Task.FromResult<long>(entity.Id);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<long> Update(CallHistory entity)
        {
            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var update = await connection.UpdateAsync(entity);
                return 1;
            }
        }

        public Task<long> Delete(long id)
        {
            throw new NotImplementedException();
        }
    }
}