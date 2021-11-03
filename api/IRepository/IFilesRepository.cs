using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using uwiserApi.Model;


namespace uwiserApi.IRepository
{
    public interface IFilesRepository : IGenericRepository<Files>
    {
        Task<IEnumerable<Files>> GetAllByUser(long id);
        Task<IEnumerable<Files>> GetAllByInterpreter(long id);
        Task<IEnumerable<Files>> GetAllInterpreterByUser(long id);
        Task<IEnumerable<Files>> GetAllUserByInterpreter(long id);
        Task<IEnumerable<Files>> GetAllByUserAndInterpreter(long userId, long interpreterId);
    }
}