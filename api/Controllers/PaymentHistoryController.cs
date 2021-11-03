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
    [Route("api/uwiser/PaymentHistory")]
    public class PaymentHistoryController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ICallRepository _icallRepository;
        private readonly IBalanceHistoryRepository _ibalanceHistoryController;
        private readonly IPaymentHistoryRepository _ipaymentHistoryController;

        public PaymentHistoryController(IUserRepository userRepository, ICallRepository icallRepository, IPaymentHistoryRepository ipaymentHistoryController, IBalanceHistoryRepository ibalanceHistoryController)
        {
            _userRepository = userRepository;
            _icallRepository = icallRepository;
            _ibalanceHistoryController = ibalanceHistoryController;
            _ipaymentHistoryController = ipaymentHistoryController;
        }

        [HttpGet("{idUser:int}")]
        [Authorize]
        [Produces(typeof(PaymentHistory))]
        public async Task<IActionResult> Get(int idUser)
        {
            var lista = await _ipaymentHistoryController.GetAll(idUser);

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpGet("all")]
        [Authorize]
        [Produces(typeof(PaymentHistory))]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _ipaymentHistoryController.GetAll();

            if (lista == null || lista.Count() == 0)
            {
                return NoContent();
            }

            return Ok(lista);
        }

        [HttpPost]
        [Authorize]
        // [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Add([FromBody] PaymentHistory obj)
        {
            var rows = await _ipaymentHistoryController.Add(obj);

            if (rows == 0)
            {
                return NoContent();
            }
            else
            {
                var rows2 = await _userRepository.AddCredits(obj.user_id, obj.seconds);

                if (rows2 == 0)
                {
                    return NoContent();
                }

                return Ok(rows2);
            }
        }

        [HttpPut("RemoveCredits")]
        [Authorize]
        // [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> RemoveCredits(PaymentHistory obj)
        {
            var rows = await _userRepository.RemoveCredits(obj.user_id, obj.seconds);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }
    }
}
