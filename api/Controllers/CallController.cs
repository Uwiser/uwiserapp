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
    [Route("api/uwiser/calls")]
    public class CallController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ICallRepository _icallRepository;

        public CallController(IUserRepository userRepository, ICallRepository icallRepository)
        {
            _userRepository = userRepository;
            _icallRepository = icallRepository;
        }

        [HttpGet("sended/{idUser:int}")]
        [Authorize]
        [Produces(typeof(CallHistory))]
        public async Task<IActionResult> GetCallsSended(int idUser)
        {
            var lista = await _icallRepository.GetCallSended(idUser);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("received/{idUser:int}")]
        [Authorize]
        [Produces(typeof(CallHistory))]
        public async Task<IActionResult> GetCallsReceived(int idUser)
        {
            var lista = await _icallRepository.GetCallReceived(idUser);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("{idUser:int}")]
        //   [Authorize]
        [Produces(typeof(CallHistory))]
        public async Task<IActionResult> GetCalls(int idUser)
        {
            var lista = await _icallRepository.GetAll(idUser);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("all")]
        [Authorize]
        [Produces(typeof(CallHistory))]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _icallRepository.GetAll();

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }
    }
}
