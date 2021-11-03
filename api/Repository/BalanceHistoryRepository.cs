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
    public class BalanceHistoryRepository : IBalanceHistoryRepository
    {
        private readonly IConfiguration _configuration;

        public BalanceHistoryRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<BalanceHistory> Get(long id)
        {
            var sql = "SELECT * FROM balance_history bh WHERE bh.id = @id";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<BalanceHistory>
                (
                    sql, new { id = id }
                );

                return result.AsList()[0];
            }
        }

        public async Task<IEnumerable<BalanceHistory>> GetAllUser(long idUser)
        {
            var sql = "SELECT * FROM balance_history bh WHERE bh.user_id = " + idUser + " ORDER BY id DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<BalanceHistory>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<BalanceHistory>> GetAllInterpreter(long idInterpreter)
        {
            var sql = "SELECT * FROM balance_history bh WHERE bh.interpreter_id = " + idInterpreter + " ORDER BY id DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<BalanceHistory>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<BalanceHistory>> GetAll()
        {
            var sql = "SELECT * FROM balance_history bh ORDER BY id DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<BalanceHistory>
                (
                    sql
                );
            }
        }

        public async Task<long> Add(BalanceHistory entity)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity.id = connection.Insert(entity);
                    return await Task.FromResult<long>(entity.id);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<long> Update(BalanceHistory entity)
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