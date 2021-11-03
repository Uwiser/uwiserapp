using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;
using uwiserApi.Model.Enum;

namespace uwiserApi.IRepository
{
    public interface IUserRepository : IGenericRepository<UserUwiser>
    {
        Task<IEnumerable<UserUwiser>> GetAllAUserCommon();
        Task<IEnumerable<UserUwiser>> GetAllAUserTranslator();
        Task<IEnumerable<UserUwiser>> GetAllAUserTranslatorActive();
        Task<UserUwiser> GetByUserName(string username);
        Task<UserUwiser> GetByUserNameVOX(string username);
        Task<UserUwiser> GetEnabled(int id);
        Task<long> AddAssessment(UserAssessment entity);
        Task<IEnumerable<UserAssessment>> GetAllAssessmentUserTranslator(long idUser, UserTypeEnum userType);
        Task<Login> Login(UserUwiser entity);
        Task<UserUwiser> GetByEmail(UserUwiser obj);
        Task<int> DeleteRemove(int id);
        Task<int> UpdateProfile(UserUwiser entity);
        Task<int> UpdatePassword(Password entity);
        Task<int> UpdateRecoverPassword(UserUwiser entity);
        Task<int> UpdateUserEnabled(UserUwiser entity);
        Task<int> UpdateLevel(UserUwiser entity);
        Task<int> AddCredits(long user_id, long seconds);
        Task<int> RemoveCredits(long user_id, long seconds);
        Task<int> AddBalance(long interpreter_id, long value);
        Task<int> RemoveBalance(long interpreter_id, long value);
        Task<IEnumerable<Admins>> GetAllAdmins();
        Task<LoginAdmin> LoginAdmin(Admins entity);
        Task<long> CreateAdmin(Admins entity);
        Task<long> UpdateAdmin(Admins entity);
        Task<int> DeleteAdmin(int id);
    }
}