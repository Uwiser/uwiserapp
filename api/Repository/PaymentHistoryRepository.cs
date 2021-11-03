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
    public class PaymentHistoryRepository : IPaymentHistoryRepository
    {
        private readonly IConfiguration _configuration;

        public PaymentHistoryRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PaymentHistory> Get(long id)
        {
            var sql = "SELECT * FROM payment_history ph WHERE ph.id = @id";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<PaymentHistory>
                (
                    sql, new { id = id }
                );

                return result.AsList()[0];
            }
        }

        public async Task<IEnumerable<PaymentHistory>> GetAll(long idUser)
        {
            var sql = "SELECT * FROM payment_history ph WHERE ph.user_id = " + idUser;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<PaymentHistory>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<PaymentHistory>> GetAll()
        {
            var sql = "SELECT * FROM payment_history ph";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<PaymentHistory>
                (
                    sql
                );
            }
        }

        public async Task<long> Add(PaymentHistory entity)
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

        public async Task<long> Update(PaymentHistory entity)
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