using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Constantes;
using uwiserApi.IRepository;
using uwiserApi.Model;
using uwiserApi.Repository;
using uwiserApi.Services;

namespace uwiserApi.Controllers
{
    [ApiController]
    [Route("api/uwiser/files")]
    public class FilesController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IFilesRepository _ifilesController;

        public FilesController(IUserRepository userRepository, IFilesRepository ifileController)
        {
            _userRepository = userRepository;
            _ifilesController = ifileController;
        }

        [HttpGet("{id:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> Get(int id)
        {
            var obj = await _ifilesController.Get(id);

            if (obj == null)
            {
                return NoContent();
            }

            return Ok(obj);
        }

        [HttpGet("user/{id:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAllByUser(int id)
        {
            var lista = await _ifilesController.GetAllByUser(id);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("interpreter/{id:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAllByInterpreter(int id)
        {
            var lista = await _ifilesController.GetAllByInterpreter(id);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("interpreterbyuser/{id:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAllInterpreterByUser(int id)
        {
            var lista = await _ifilesController.GetAllInterpreterByUser(id);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("userbyinterpreter/{id:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAllUserByInterpreter(int id)
        {
            var lista = await _ifilesController.GetAllUserByInterpreter(id);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("userandinterpreter/{userId:int}/{interpreterId:int}")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAllByUserAndInterpreter(int userId, int interpreterId)
        {
            var lista = await _ifilesController.GetAllByUserAndInterpreter(userId, interpreterId);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("all")]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _ifilesController.GetAll();

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpPost]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> Add([FromBody] Files obj)
        {
            try
            {
                var rows = await _ifilesController.Add(obj);

                if (rows == 0)
                {
                    return NoContent();
                }

                return Ok(rows);
            }
            catch (Exception e)
            {
                return StatusCode(400, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> Update(Files obj)
        {
            var rows = await _ifilesController.Update(obj);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpDelete]
        [Authorize]
        [Produces(typeof(Files))]
        public async Task<IActionResult> Delete(int id)
        {
            var rows = await _ifilesController.Delete(id);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }
    }
}
