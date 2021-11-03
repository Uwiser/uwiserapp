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
    [Route("api/uwiser/parameters")]
    public class ParametersController : ControllerBase
    {
        private readonly IParametersRepository _iparametersController;

        public ParametersController(IParametersRepository iparametersController)
        {
            _iparametersController = iparametersController;
        }

        [HttpGet("promotion")]
        [Produces(typeof(Parameters))]
        public async Task<IActionResult> GetPromotion()
        {
            var obj = await _iparametersController.GetPromotion();

            if (obj == null)
            {
                return NoContent();
            }

            return Ok(obj);
        }
    }
}
