using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;


namespace uwiserApi.IRepository
{
    public interface IParametersRepository
    {
        Task<Parameters> GetPromotion();
    }
}