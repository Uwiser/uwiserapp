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
    public class ParametersRepository : IParametersRepository
    {
        private readonly IConfiguration _configuration;

        public ParametersRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Parameters> GetPromotion()
        {
            var sql = "SELECT * FROM parameters p WHERE p.parameter_name = 'promotion'";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<Parameters>(sql);

                return result.AsList()[0];
            }
        }
    }
}