using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using uwiserApi.Model;
using uwiserApi.Services;
using MySql.Data.MySqlClient;
using Dapper;
using uwiserApi.Model.Enum;
using Dapper.Contrib;
using Dapper.Contrib.Extensions;
using uwiserApi.IRepository;
using System.Linq;

namespace uwiserApi.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IConfiguration _configuration;

        public UserRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<UserUwiser> GetByUserNameVOX(string username)
        {
            // u.id, u.name, u.email, u.cpf, u.registration, u.age, u.level, u.image, u.type, u.city_id, u.dependent, c.*
            var sql = @"SELECT * FROM user_uwiser u WHERE u.usernamevox = '" + username + "'";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var user = await connection.QueryFirstOrDefaultAsync<UserUwiser>
                (
                    sql
                );
                if (user != null && user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                {
                    var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                    user.assessments = assessement.AsList();
                }

                return user;
            }
        }

        public async Task<UserUwiser> Get(long id)
        {
            // u.id, u.name, u.email, u.cpf, u.registration, u.age, u.level, u.image, u.type, u.city_id, u.dependent, c.*
            var sql = @"SELECT * FROM user_uwiser u WHERE u.id = " + id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var user = await connection.QueryFirstOrDefaultAsync<UserUwiser>
                (
                    sql
                );
                if (user != null && user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                {
                    var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                    user.assessments = assessement.AsList();
                }
                return user;
            }
        }

        public async Task<UserUwiser> GetByUserName(String username)
        {
            // u.id, u.name, u.email, u.cpf, u.registration, u.age, u.level, u.image, u.type, u.city_id, u.dependent, c.*
            var sql = @"SELECT * FROM user_uwiser u WHERE u.usernamevox = @username ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var user = await connection.QueryFirstOrDefaultAsync<UserUwiser>(sql, new { username = username });
                if (user != null && user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                {
                    var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                    user.assessments = assessement.AsList();
                }
                return user;
            }
        }

        public async Task<IEnumerable<UserUwiser>> GetAllAUserCommon()
        {
            var sql = $"SELECT * FROM user_uwiser u WHERE u.deleted is null AND u.user_type_id = {UserTypeEnum.COMMOM.GetHashCode()} ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<UserUwiser>(sql);
            }
        }

        public async Task<IEnumerable<UserUwiser>> GetAllAUserTranslator()
        {
            var sql = $"SELECT * FROM user_uwiser u WHERE u.deleted is null AND u.user_type_id = {UserTypeEnum.TRANSLATOR.GetHashCode()} ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var users = await connection.QueryAsync<UserUwiser>(sql);

                foreach (var user in users)
                {
                    if (user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                    {
                        var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                        user.assessments = assessement.AsList();
                    }
                }
                return users;

            }
        }

        public async Task<IEnumerable<UserUwiser>> GetAllAUserTranslatorActive()
        {
            var sql = $"SELECT * FROM user_uwiser u WHERE u.enabled = 1 AND u.deleted is null AND u.user_type_id = {UserTypeEnum.TRANSLATOR.GetHashCode()} ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var users = await connection.QueryAsync<UserUwiser>(sql);

                foreach (var user in users)
                {
                    if (user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                    {
                        var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                        user.assessments = assessement.AsList();
                    }
                }
                return users;

            }
        }

        public async Task<IEnumerable<UserUwiser>> GetAll()
        {
            var sql = "SELECT * FROM user_uwiser u  WHERE u.deleted is null ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var users = await connection.QueryAsync<UserUwiser>
                (
                    sql
                );
                foreach (var user in users)
                {
                    if (user.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                    {
                        var assessement = await GetAllAssessmentUserTranslator(user.id, UserTypeEnum.TRANSLATOR);
                        user.assessments = assessement.AsList();
                    }
                }
                return users;
            }
        }

        public async Task<UserUwiser> GetEnabled(int id)
        {
            var sql = "UPDATE user_uwiser SET enabled = 1 WHERE id = " + id + ";";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.ExecuteAsync(sql);
            }

            return await Get(id);
        }
        public Task<long> Add(UserUwiser entity)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity.id = connection.Insert(entity);
                    return Task.FromResult<long>(entity.id);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Login> Login(UserUwiser entity)
        {
            var sql = "SELECT * FROM user_uwiser WHERE email = @email AND password = @password AND deleted IS NULL";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity = await connection.QueryFirstOrDefaultAsync<UserUwiser>(sql, new { email = entity.email, password = entity.password });

                    if (entity == null)
                    {
                        return null;
                    }
                    if (entity.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
                    {
                        var assessement = await GetAllAssessmentUserTranslator(entity.id, UserTypeEnum.TRANSLATOR);
                        entity.assessments = assessement.AsList();
                    }
                }
                var token = TokenService.GenerateToken(entity.email);
                entity.password = "";
                return await Task.Run(() =>
                {
                    return new Login
                    {
                        User = entity,
                        Token = token
                    };
                });
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<UserUwiser> GetByEmail(UserUwiser entity)
        {
            var sql = "SELECT * FROM user_uwiser u WHERE u.email = '" + entity.email + "' AND deleted IS NULL  ORDER BY u.name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<UserUwiser>(sql, new
                {
                    email = entity.email
                }
                );
                return result.AsList()[0];
            }
        }

        public async Task<int> DeleteRemove(int id)
        {
            var sql = "DELETE FROM user_uwiser WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, new { id = id });
            }
        }

        public async Task<long> Delete(long id)
        {
            DateTime date = DateTime.Now.ToLocalTime();
            var sql = "UPDATE user_uwiser SET deleted = '" + date.ToString("yyyy-MM-dd H:mm:ss") + "' WHERE id = @id ";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, new { id = id });
            }
        }

        public async Task<long> Update(UserUwiser entity)
        {
            var userOrigin = await Get(entity.id);
            if (userOrigin != null)
            {
                //Dados alteraveis
                if (!String.IsNullOrEmpty(entity.name))
                {
                    userOrigin.name = entity.name;
                }
                if (!String.IsNullOrEmpty(entity.cpf))
                {
                    userOrigin.cpf = entity.cpf;
                }
                if (!String.IsNullOrEmpty(entity.phone))
                {
                    userOrigin.phone = entity.phone;
                }
                if (entity.age != null)
                {
                    userOrigin.age = entity.age;
                }
                if (!String.IsNullOrEmpty(entity.City))
                {
                    userOrigin.City = entity.City;
                }
                if (!String.IsNullOrEmpty(entity.Specialty))
                {
                    userOrigin.Specialty = entity.Specialty;
                }
                if (!String.IsNullOrEmpty(entity.email_paypal))
                {
                    userOrigin.email_paypal = entity.email_paypal;
                }
                if (!String.IsNullOrEmpty(entity.Description))
                {
                    userOrigin.Description = entity.Description;
                }
                if (!String.IsNullOrEmpty(entity.Image))
                {
                    userOrigin.Image = entity.Image;
                }
                if (!String.IsNullOrEmpty(entity.country))
                {
                    userOrigin.country = entity.country;
                }
                if (!String.IsNullOrEmpty(entity.languages))
                {
                    userOrigin.languages = entity.languages;
                }
                if (!String.IsNullOrEmpty(entity.description_en))
                {
                    userOrigin.description_en = entity.description_en;
                }
                if (!String.IsNullOrEmpty(entity.description_es))
                {
                    userOrigin.description_es = entity.description_es;
                }
                if (!String.IsNullOrEmpty(entity.description_fr))
                {
                    userOrigin.description_fr = entity.description_fr;
                }
                if (!String.IsNullOrEmpty(entity.description_jp))
                {
                    userOrigin.description_jp = entity.description_jp;
                }
                if (!String.IsNullOrEmpty(entity.description_pt))
                {
                    userOrigin.description_pt = entity.description_pt;
                }
                if (!String.IsNullOrEmpty(entity.language_app))
                {
                    userOrigin.language_app = entity.language_app;
                }

                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    var update = await connection.UpdateAsync(userOrigin);
                    return 1;
                }
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> UpdateProfile(UserUwiser entity)
        {
            var sql = "UPDATE users SET name = @name, image = @image WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<int> UpdatePassword(Password entity)
        {
            var sql = "UPDATE user_uwiser SET password = @newpassword WHERE id = @id AND password = @oldpassword;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<int> UpdateRecoverPassword(UserUwiser entity)
        {
            var sql = "UPDATE user_uwiser SET password = @password WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<int> UpdateUserEnabled(UserUwiser entity)
        {
            var sql = "UPDATE user_uwiser SET enabled = @enabled WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<int> UpdateLevel(UserUwiser entity)
        {
            var sql = "UPDATE user_uwiser SET level = @level WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<int> AddCredits(long user_id, long seconds)
        {
            var sql = "UPDATE user_uwiser SET credits = (credits + " + seconds + ") WHERE id = " + user_id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql);
            }
        }

        public async Task<int> RemoveCredits(long user_id, long seconds)
        {
            var sql = "UPDATE user_uwiser SET credits = (credits - " + seconds + ") WHERE id = " + user_id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql);
            }
        }

        public async Task<int> AddBalance(long interpreter_id, long value)
        {
            var sql = "UPDATE user_uwiser SET balance = (balance + " + value + ") WHERE id = " + interpreter_id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql);
            }
        }

        public async Task<int> RemoveBalance(long interpreter_id, long value)
        {
            var sql = "UPDATE user_uwiser SET balance = (balance - " + value + ") WHERE id = " + interpreter_id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql);
            }
        }

        public Task<long> AddAssessment(UserAssessment entity)
        {
            try
            {
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

        public async Task<IEnumerable<UserAssessment>> GetAllAssessmentUserTranslator(long idUser, UserTypeEnum userType)
        {
            string sql = "";
            if (userType == UserTypeEnum.COMMOM)
            {
                sql = $"SELECT * FROM user_assessment u WHERE u.UserId = {idUser}  ORDER BY u.Id asc";
            }
            else
            {
                sql = $"SELECT * FROM user_assessment u WHERE u.UserIdTranslator = {idUser} ORDER BY u.Id asc";
            }
            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<UserAssessment>(sql);
                return result;

            }
        }

        public async Task<LoginAdmin> LoginAdmin(Admins entity)
        {
            var sql = "SELECT * FROM admins WHERE email = @email AND password = @password";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity = await connection.QueryFirstOrDefaultAsync<Admins>(sql, new { email = entity.email, password = entity.password });
                }
                var token = TokenService.GenerateToken(entity.email);
                entity.password = "";

                return await Task.Run(() =>
                {
                    return new LoginAdmin
                    {
                        Admins = entity,
                        Token = token
                    };
                });
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Admins> GetAdmin(long id)
        {
            // u.id, u.name, u.email, u.cpf, u.registration, u.age, u.level, u.image, u.type, u.city_id, u.dependent, c.*
            var sql = @"SELECT * FROM admins a WHERE a.id = " + id;

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var user = await connection.QueryFirstOrDefaultAsync<Admins>
                (
                    sql
                );
                return user;
            }
        }

        public async Task<IEnumerable<Admins>> GetAllAdmins()
        {
            var sql = $"SELECT * FROM admins ORDER BY name asc";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.QueryAsync<Admins>(sql);
            }
        }

        public Task<long> CreateAdmin(Admins entity)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    entity.id = connection.Insert(entity);
                    return Task.FromResult<long>(entity.id);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<long> UpdateAdmin(Admins entity)
        {
            var adminOrigin = await GetAdmin(entity.id);
            if (adminOrigin != null)
            {
                //Dados alteraveis
                if (!String.IsNullOrEmpty(entity.name))
                {
                    adminOrigin.name = entity.name;
                }
                if (!String.IsNullOrEmpty(entity.email))
                {
                    adminOrigin.email = entity.email;
                }

                using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    var update = await connection.UpdateAsync(adminOrigin);
                    return 1;
                }
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> DeleteAdmin(int id)
        {
            var sql = "DELETE FROM admins WHERE id = @id;";

            using (MySqlConnection connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                return await connection.ExecuteAsync(sql, new { id = id });
            }
        }
    }
}