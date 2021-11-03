using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Constantes;
using Stripe;
using uwiserApi.IRepository;
using uwiserApi.Model;
using uwiserApi.Model.Enum;
using uwiserApi.Repository;
using uwiserApi.Services;
using uwiserApi.Utils;
using Voximplant.API;


namespace uwiserApi.Controllers
{
    [ApiController]
    [Route("api/uwiser/users")]
    public class UserUwiserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        private readonly ICallRepository _icallRepository;

        private VoximplantAPI _voximplantAPI;

        public UserUwiserController(IUserRepository userRepository, ICallRepository icallRepository)
        {
            _userRepository = userRepository;
            _icallRepository = icallRepository;
            var pathCompleto = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location).ToString(), "resources" + Path.DirectorySeparatorChar + "key-vox.json");
            var config = new ClientConfiguration
            {
                KeyFile = pathCompleto
            };
            this._voximplantAPI = new VoximplantAPI(config);
        }

        [HttpGet("usernamevox/{username}")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetByUserNameVOX(string username)
        {
            var obj = await _userRepository.GetByUserNameVOX(username);

            if (obj == null)
            {
                return NoContent();
            }

            return Ok(obj);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Get(int id)
        {
            var obj = await _userRepository.Get(id);

            if (obj == null)
            {
                return NoContent();
            }

            return Ok(obj);
        }

        [HttpGet("commom")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetAllAUserCommon()
        {
            var users = await _userRepository.GetAllAUserCommon();

            if (users.Count() == 0)
            {
                return NoContent();
            }

            return Ok(users);
        }

        [HttpGet("translator")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetAllAUserTranslator()
        {
            var users = await _userRepository.GetAllAUserTranslator();

            if (users.Count() == 0)
            {
                return NoContent();
            }

            return Ok(users);
        }

        [HttpGet("translatoractive")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetAllAUserTranslatorActive()
        {
            var users = await _userRepository.GetAllAUserTranslatorActive();

            if (users.Count() == 0)
            {
                return NoContent();
            }

            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAll();

            if (users.Count() == 0)
            {
                return NoContent();
            }

            return Ok(users);
        }

        [HttpGet("enabled/{id:int}")]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetEnabled(int id)
        {
            var obj = await _userRepository.GetEnabled(id);

            if (obj == null)
            {
                return NoContent();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Add([FromBody] UserUwiser userUwiser)
        {
            if (userUwiser.Description != null && userUwiser.Description != "")
            {
                TranslationUtils translationUtils = new TranslationUtils();

                switch (userUwiser.language_app)
                {
                    case "pt":
                        userUwiser.description_pt = userUwiser.Description;
                        userUwiser.description_es = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "es");
                        userUwiser.description_en = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "en");
                        userUwiser.description_jp = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "ja");
                        userUwiser.description_fr = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "fr");
                        break;
                    case "es":
                        userUwiser.description_pt = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "pt");
                        userUwiser.description_es = userUwiser.Description;
                        userUwiser.description_en = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "en");
                        userUwiser.description_jp = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "ja");
                        userUwiser.description_fr = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "fr");
                        break;
                    case "en":
                        userUwiser.description_pt = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "pt");
                        userUwiser.description_es = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "es");
                        userUwiser.description_en = userUwiser.Description;
                        userUwiser.description_jp = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "ja");
                        userUwiser.description_fr = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "fr");
                        break;
                    case "ja":
                        userUwiser.description_pt = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "pt");
                        userUwiser.description_es = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "es");
                        userUwiser.description_en = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "en");
                        userUwiser.description_jp = userUwiser.Description;
                        userUwiser.description_fr = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "fr");
                        break;
                    case "fr":
                        userUwiser.description_pt = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "pt");
                        userUwiser.description_es = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "es");
                        userUwiser.description_en = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "en");
                        userUwiser.description_jp = translationUtils.Translate(userUwiser.Description, userUwiser.language_app, "ja");
                        userUwiser.description_fr = userUwiser.Description;
                        break;
                    default:
                        break;
                }
            }

            try
            {
                Random r = new Random(DateTime.Now.Millisecond);
                string username = userUwiser.name.Replace(" ", "").ToLower() + "_" + r.Next(0, 9999999);
                var resultAddUser = await _voximplantAPI.AddUser(
                username,
                    userUwiser.name,
                    userUwiser.password,
                    applicationId: Constantes.APPLICATION_VOX_ID
                );
                if (resultAddUser.Result == 1)
                {
                    userUwiser.created = DateTime.Now.ToLocalTime();
                    userUwiser.idvox = resultAddUser.UserId;
                    userUwiser.usernamevox = username;
                    var rows = await _userRepository.Add(userUwiser);
                    if (rows > 0)
                    {
                        EmailUtils emailUtils = new EmailUtils();
                        if (userUwiser.user_type_id == UserTypeEnum.COMMOM.GetHashCode())
                        {
                            string body = "<h3>Olá, " + userUwiser.name + @"!</h3>";
                            body += @"<p>**Para validar a sua conta e começar a utilizar o nosso app <a href='http://validate.uwiser.jp/Enabled/" + userUwiser.id + @"'>clique aqui</a>**</p>
                            <p>Agora você tem acesso ao nosso aplicativo uwiser - o jeito fácil de se comunicar!</p>
                            <p>Dificuldade em resolver problemas simples do cotidiano devido ao idioma estrangeiro? A uwiser facilita sua vida! Com o nosso aplicativo você poderá desfrutar de intérpretes on line!</p>
                            <p>Coloque créditos e comece a usar agora mesmo!</p>";
                            //   <p>Para acessar o aplicativo, baixe-o na loja <a href='https://apps.apple.com/us/app/id1526683054'>Apple Store</a> ou <a href='https://play.google.com/store/apps/details?id=br.com.mergulho'>Google Play</a></p>
                            body += @"<p>Qualquer dúvida estamos a disposição!</p>
                            <p>Atenciosamente,</p>
                            <p>Equipe uwiser</p>";

                            emailUtils.SendEmail("Bem-vindo ao Aplicativo Uwiser! Valide o seu e-mail!", body, userUwiser.email);
                        }
                        else
                        {
                            string body = "<h3>Cadastro de novo intérprete: " + userUwiser.name + @"</h3>";
                            body += "<h3>E-mail: " + userUwiser.email + @"</h3>";
                            //   <p>Para acessar o aplicativo, baixe-o na loja <a href='https://apps.apple.com/us/app/id1526683054'>Apple Store</a> ou <a href='https://play.google.com/store/apps/details?id=br.com.mergulho'>Google Play</a></p>

                            emailUtils.SendEmail("Cadastro de novo intérprete", body, "contact@uwiser.jp");
                        }

                        return Ok(userUwiser);
                    }
                    else
                    {
                        return NoContent();
                    }
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                return StatusCode(409, e.Message);
            }
        }

        [HttpPost("Login")]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Login([FromBody] UserUwiser obj)
        {
            var login = await _userRepository.Login(obj);

            if (login == null)
            {
                return BadRequest();
            }

            if (login.User.enabled == 0)
            {
                if (login.User.user_type_id == UserTypeEnum.COMMOM.GetHashCode())
                {
                    return StatusCode(419, "User disabled");
                }
                else
                {
                    return StatusCode(418, "Interpreter disabled");
                }
            }

            return Ok(login);
        }

        [HttpPost("Assessment")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Assessment([FromBody] UserAssessment obj)
        {
            var assessment = await _userRepository.AddAssessment(obj);

            if (assessment == 1)
            {
                return BadRequest();
            }

            return Ok(assessment);
        }

        [HttpGet("Assessment/{id:int}")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetAssessment(int id)
        {
            var obj = await _userRepository.Get(id);

            if (obj == null)
            {
                return NoContent();
            }
            if (obj.user_type_id == UserTypeEnum.TRANSLATOR.GetHashCode())
            {
                var assessments = await _userRepository.GetAllAssessmentUserTranslator(id, UserTypeEnum.TRANSLATOR);
                obj.assessments = assessments.ToList();
            }
            return Ok(obj);
        }


        [HttpGet("Assessment/media/{id:int}")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetMediaAssessment(int id)
        {
            double media = 0;
            var assessments = await _userRepository.GetAllAssessmentUserTranslator(id, UserTypeEnum.TRANSLATOR);
            if (assessments != null && assessments.Count() > 0)
            {
                media = assessments.ToList().Average(assessments => assessments.value);
            }

            return Ok(media);
        }

        [HttpPost("Email")]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> GetByEmail([FromBody] UserUwiser obj)
        {
            var user = await _userRepository.GetByEmail(obj);

            if (user == null)
            {
                return StatusCode(403, "E-mail inválido.");
            }

            string newPassword = "";
            user.name.Split(" ").ToList().ForEach(i => newPassword += i[0]);
            user.password = newPassword + "#" + user.id;
            if (user.password.Length < 8)
            {
                user.password = user.password.PadRight(8, '0');
            }
            try
            {
                var result = await _voximplantAPI.SetUserInfo(
                    userId: user.idvox,
                    userPassword: user.password
                );
                Console.WriteLine($"Response: {result.ToString()}");
                if (result.Result == 1)
                {
                    var rows = await _userRepository.UpdateRecoverPassword(user);

                    if (rows == 0)
                    {
                        return StatusCode(403, "E-mail inválido.");
                    }

                    string body = @"<h3>Olá, " + user.name + @"!</h3>
                            <p>Foi solicitada uma nova senha no Aplicativo uwiser para o seu usuário.</p>
                            <p>Utilize esta nova senha para acessar o aplicativo: <b>" + user.password + @"</b></p>
                            <p>Ao fazer login, sugerimos que altere a senha.</p>
                            <p>Se você não fez esta solicitação, ignore este e-mail.</p>
                            <p>Atenciosamente,</p>
                            <p>Equipe uwiser</p>";

                    EmailUtils emailUtils = new EmailUtils();
                    emailUtils.SendEmail("Solicitação de redefinição de senha - Aplicativo uwiser", body, user.email);

                    return Ok(user);
                }
                else
                {
                    return StatusCode(403, "Erro ao atualizar email no serviço voximplant");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
            }
            return StatusCode(403, "E-mail inválido.");

        }

        [HttpDelete]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Delete(int id)
        {
            var rows = await _userRepository.Delete(id);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpDelete("Remove")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> DeleteRemove(int id)
        {
            var rows = await _userRepository.DeleteRemove(id);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpPut]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> Update(UserUwiser obj)
        {
            var user = await _userRepository.Get(obj.id);

            if (obj.Description != null && obj.Description != "" && obj.Description != user.Description)
            {
                TranslationUtils translationUtils = new TranslationUtils();

                switch (obj.language_app)
                {
                    case "pt":
                        obj.description_pt = obj.Description;
                        obj.description_es = translationUtils.Translate(obj.Description, obj.language_app, "es");
                        obj.description_en = translationUtils.Translate(obj.Description, obj.language_app, "en");
                        obj.description_jp = translationUtils.Translate(obj.Description, obj.language_app, "ja");
                        obj.description_fr = translationUtils.Translate(obj.Description, obj.language_app, "fr");
                        break;
                    case "es":
                        obj.description_pt = translationUtils.Translate(obj.Description, obj.language_app, "pt");
                        obj.description_es = obj.Description;
                        obj.description_en = translationUtils.Translate(obj.Description, obj.language_app, "en");
                        obj.description_jp = translationUtils.Translate(obj.Description, obj.language_app, "ja");
                        obj.description_fr = translationUtils.Translate(obj.Description, obj.language_app, "fr");
                        break;
                    case "en":
                        obj.description_pt = translationUtils.Translate(obj.Description, obj.language_app, "pt");
                        obj.description_es = translationUtils.Translate(obj.Description, obj.language_app, "es");
                        obj.description_en = obj.Description;
                        obj.description_jp = translationUtils.Translate(obj.Description, obj.language_app, "ja");
                        obj.description_fr = translationUtils.Translate(obj.Description, obj.language_app, "fr");
                        break;
                    case "ja":
                        obj.description_pt = translationUtils.Translate(obj.Description, obj.language_app, "pt");
                        obj.description_es = translationUtils.Translate(obj.Description, obj.language_app, "es");
                        obj.description_en = translationUtils.Translate(obj.Description, obj.language_app, "en");
                        obj.description_jp = obj.Description;
                        obj.description_fr = translationUtils.Translate(obj.Description, obj.language_app, "fr");
                        break;
                    case "fr":
                        obj.description_pt = translationUtils.Translate(obj.Description, obj.language_app, "pt");
                        obj.description_es = translationUtils.Translate(obj.Description, obj.language_app, "es");
                        obj.description_en = translationUtils.Translate(obj.Description, obj.language_app, "en");
                        obj.description_jp = translationUtils.Translate(obj.Description, obj.language_app, "ja");
                        obj.description_fr = obj.Description;
                        break;
                    default:
                        break;
                }
            }

            var rows = await _userRepository.Update(obj);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpPut("Profile")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> UpdateProfile(UserUwiser obj)
        {
            var rows = await _userRepository.UpdateProfile(obj);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpPut("Password")]
        // [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> UpdatePassword(Password obj)
        {
            var user = await _userRepository.Get(obj.Id);

            var result = await _voximplantAPI.SetUserInfo(
                    userId: user.idvox,
                    userPassword: obj.Newpassword
                );
            Console.WriteLine($"Response: {result.ToString()}");
            if (result.Result == 1)
            {
                var rows = await _userRepository.UpdatePassword(obj);

                if (rows == 0)
                {
                    return StatusCode(403, "Senha atual inválida.");
                }

                return Ok(rows);
            }
            else
            {

                return StatusCode(403, "Erro ao atualizar senha no serviço voximplant.");
            }
        }

        [HttpPut("enabled")]
        [Authorize]
        [Produces(typeof(UserUwiser))]
        public async Task<IActionResult> UpdateUserEnabled(UserUwiser obj)
        {
            var rows = await _userRepository.UpdateUserEnabled(obj);

            if (rows == 0)
            {
                return NoContent();
            }

            if (obj.enabled == 1)
            {
                var user = await _userRepository.Get(obj.id);

                EmailUtils emailUtils = new EmailUtils();
                string body = "<h3>Olá, " + user.name + @"!</h3>
                <p>É um prazer poder contar com você em nossa equipe de intérpretes!</p>
                <p>Esperamos que você receba muitas ligações e que ajude muitas pessoas com sua sabedoria!</p>
                <p>Lembre-se que ao final de cada ligação nosso cliente poderá avaliar seu atendimento, então dê o seu melhor!</p>
                <p>Seus dados de acesso são:</p>
                <p>E-mail: " + user.email + @"</p>
                <p>Senha: " + user.password + @"</p>
                <p>Qualquer dúvida estamos a disposição!</p>
                <p>Atenciosamente,</p>
                <p>Equipe uwiser</p>";

                emailUtils.SendEmail("Bem-vindo ao Aplicativo Uwiser!", body, user.email);
            }

            return Ok(rows);
        }

        [HttpPost("Payment")]
        [Authorize]
        // [Produces(typeof(UserUwiser))]
        public IActionResult Payment(Payment obj)
        {
            StripeConfiguration.ApiKey = "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";

            var options = new PaymentIntentCreateOptions
            {
                Amount = obj.amount,
                Currency = obj.currency,
                PaymentMethodTypes = new List<string>
                {
                    "card",
                },
            };
            var service = new PaymentIntentService();

            return Ok(service.Create(options).ToJson());
        }

        [HttpPost("admin/login")]
        [Produces(typeof(Admins))]
        public async Task<IActionResult> LoginAdmin([FromBody] Admins obj)
        {
            var login = await _userRepository.LoginAdmin(obj);

            if (login == null)
            {
                return BadRequest();
            }

            return Ok(login);
        }

        [HttpGet("admins")]
        [Authorize]
        [Produces(typeof(Admins))]
        public async Task<IActionResult> GetAllAdmins()
        {
            var users = await _userRepository.GetAllAdmins();

            if (users.Count() == 0)
            {
                return NoContent();
            }

            return Ok(users);
        }

        [HttpPost("admin")]
        [Authorize]
        [Produces(typeof(Admins))]
        public async Task<IActionResult> CreateAdmin([FromBody] Admins obj)
        {
            try
            {
                var rows = await _userRepository.CreateAdmin(obj);
                return Ok(rows);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                return StatusCode(409, e.Message);
            }
        }

        [HttpPut("admin")]
        [Authorize]
        [Produces(typeof(Admins))]
        public async Task<IActionResult> UpdateAdmin(Admins obj)
        {
            var rows = await _userRepository.UpdateAdmin(obj);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }

        [HttpDelete("admin")]
        [Authorize]
        [Produces(typeof(Admins))]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var rows = await _userRepository.DeleteAdmin(id);

            if (rows == 0)
            {
                return NoContent();
            }

            return Ok(rows);
        }
    }
}
