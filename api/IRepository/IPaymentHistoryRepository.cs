using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;


namespace uwiserApi.IRepository
{
    public interface IPaymentHistoryRepository : IGenericRepository<PaymentHistory>
    {
        Task<IEnumerable<PaymentHistory>> GetAll(long userId);
    }
}