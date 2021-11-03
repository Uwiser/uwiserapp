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
    public class FilesRepository : IFilesRepository
    {
        private readonly IConfiguration _configuration;

        public FilesRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Files> Get(long id)
        {
            var sql = "SELECT * FROM files f WHERE f.id = @id";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<Files>
                (
                    sql, new { id = id }
                );

                return result.AsList()[0];
            }
        }

        public async Task<IEnumerable<Files>> GetAllByUser(long id)
        {
            var sql = "SELECT * FROM files f WHERE f.user_id = " + id + " ORDER BY f.id DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<Files>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<Files>> GetAllByInterpreter(long id)
        {
            var sql = "SELECT * FROM files f WHERE f.interpreter_id = " + id + " ORDER BY f.id DESC";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<Files>
                (
                    sql
                );
            }
        }

        public async Task<IEnumerable<Files>> GetAllInterpreterByUser(long id)
        {
            var sql = "SELECT * FROM files f INNER JOIN user_uwiser u ON u.id = f.interpreter_id WHERE f.user_id = " + id + " AND f.id IN (SELECT MAX(id) FROM files GROUP BY interpreter_id) GROUP BY interpreter_id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var files = await connection.QueryAsync<Files, UserUwiser, Files>
                (
                    sql,
                    (files, userUwiser) =>
                    {
                        files.UserObject = userUwiser;
                        return files;
                    }
                );

                return files;
            }
        }

        public async Task<IEnumerable<Files>> GetAllUserByInterpreter(long id)
        {
            var sql = "SELECT * FROM files f INNER JOIN user_uwiser u ON u.id = f.interpreter_id WHERE f.user_id = " + id + " AND f.id IN (SELECT MAX(id) FROM files GROUP BY user_id) GROUP BY user_id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var files = await connection.QueryAsync<Files, UserUwiser, Files>
                (
                    sql,
                    (files, userUwiser) =>
                    {
                        files.InterpreterObject = userUwiser;
                        return files;
                    }
                );

                return files;
            }
        }

        public async Task<IEnumerable<Files>> GetAllByUserAndInterpreter(long userId, long interpreterId)
        {
            var sql = "SELECT * FROM files f INNER JOIN user_uwiser u ON u.id = f.user_id INNER JOIN user_uwiser uw ON uw.id = f.interpreter_id WHERE f.user_id = " + userId + " AND f.interpreter_id = " + interpreterId;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var files = await connection.QueryAsync<Files, UserUwiser, UserUwiser, Files>
                (
                    sql,
                    (files, user, interpreter) =>
                    {
                        files.UserObject = user;
                        files.InterpreterObject = interpreter;
                        return files;
                    }
                );

                return files;
            }
        }

        public async Task<IEnumerable<Files>> GetAll()
        {
            var sql = "SELECT * FROM files f";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<Files>
                (
                    sql
                );
            }
        }

        public async Task<long> Add(Files entity)
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

        public async Task<long> Update(Files entity)
        {
            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var update = await connection.UpdateAsync(entity);
                return 1;
            }
        }

        public async Task<long> Delete(long id)
        {
            var sql = "DELETE FROM files WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, new { id = id });
            }
        }
    }
}