using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;


namespace uwiserApi.IRepository
{
    public interface IBalanceHistoryRepository : IGenericRepository<BalanceHistory>
    {
        Task<IEnumerable<BalanceHistory>> GetAllUser(long userId);
        Task<IEnumerable<BalanceHistory>> GetAllInterpreter(long interpreterId);
    }
}