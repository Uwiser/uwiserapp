using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;


namespace uwiserApi.IRepository
{
    public interface ICallRepository : IGenericRepository<CallHistory>
    {
        Task<IEnumerable<CallHistory>> GetAll(long userId);
        Task<IEnumerable<CallHistory>> GetCallReceived(long id);
        Task<IEnumerable<CallHistory>> GetCallSended(long id);
        Task<CallHistory> GetCallByID(long idCall);
        Task<long> ExisteCallByID(long idCall);
    }
}