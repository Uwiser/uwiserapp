// using System;
// using System.IO;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using uwiserApi.Model;
// using uwiserApi.Repository;
// using uwiserApi.Utils;

// namespace uwiserApi.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class UserController : ControllerBase
//     {
//         private readonly IUserRepository _userRepository;

//         public UserController(IUserRepository userRepository)
//         {
//             _userRepository = userRepository;
//         }

//         [HttpGet("{id:int}")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> Get(int id)
//         {
//             var obj = await _userRepository.Get(id);

//             if (obj == null)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet("Admin")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllAdmins()
//         {
//             var users = await _userRepository.GetAllAdmins();

//             if (users.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(users);
//         }

//         [HttpGet("Admins/City/{id:int}")]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllAdminsByCity(int id)
//         {
//             var obj = await _userRepository.GetAllAdminsByCity(id);

//             if (obj.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet("Teacher")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllTeachers()
//         {
//             var users = await _userRepository.GetAllTeachers();

//             if (users.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(users);
//         }

//         [HttpGet("Teachers/City/{id:int}")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllTeachersByCity(int id)
//         {
//             var obj = await _userRepository.GetAllTeachersByCity(id);

//             if (obj.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet("Student")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllStudents()
//         {
//             var users = await _userRepository.GetAllStudents();

//             if (users.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(users);
//         }

//         [HttpGet("Students")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllStudentsByClass(int id)
//         {
//             var users = await _userRepository.GetAllStudentsByClass(id);

//             if (users.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(users);
//         }

//         [HttpGet("Students/City/{id:int}")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAllStudentsByCity(int id)
//         {
//             var obj = await _userRepository.GetAllStudentsByCity(id);

//             if (obj.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet("StudentByRegistration")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetStudentByRegistration(int registration)
//         {
//             var user = await _userRepository.GetStudentByRegistration(registration);

//             if (user == null)
//             {
//                 return NoContent();
//             }

//             return Ok(user);
//         }

//         [HttpGet("Dependents/Responsible/{id:int}")]
//         [Authorize]
//         [Produces(typeof(User))]
        
//         public async Task<IActionResult> GetAllDependentsByResponsible(int id)
//         {
//             var obj = await _userRepository.GetAllDependentsByResponsible(id);

//             if (obj.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet("Dependents/City/{id:int}")]
//         [Authorize]
//         [Produces(typeof(User))]
        
//         public async Task<IActionResult> GetAllDependentsByCity(int id)
//         {
//             var obj = await _userRepository.GetAllDependentsByCity(id);

//             if (obj.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(obj);
//         }

//         [HttpGet]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetAll()
//         {
//             var users = await _userRepository.GetAll();

//             if (users.Count() == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(users);
//         }

//         [HttpPost]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> Add([FromBody] User obj)
//         {
//             string newPassword = "";
//             obj.Name.Split(" ").ToList().ForEach(i => newPassword += i[0]);
//             obj.Password = newPassword + "#2020";
//             string body = "<h3>Olá, " + obj.Name + @"!</h3>";

//             if (obj.UserType_Id == 3) 
//             {
//                 body += @"<p>Agora você tem acesso ao nosso aplicativo e sistema administrativo.</p>
//                 <p>Nele você compartilha notícias, envia avisos, faz as avaliações dos alunos e atualiza os níveis deles.</p>
//                 <p>Para acessar o aplicativo, baixe-o na loja <a href='https://apps.apple.com/us/app/id1526683054'>Apple Store</a> ou <a href='https://play.google.com/store/apps/details?id=br.com.mergulho'>Google Play</a></p>
//                 <p>Para acessar a plataforma <a href='http://68.183.18.172/'>clique aqui</a></p>";
//             }
//             else if (obj.UserType_Id == 2)
//             {
//                 body += @"<p>Agora você tem acesso ao nosso Mergulho App.</p>
//                 <p>Nele você compartilha notícias, envia avisos, faz as avaliações dos alunos e atualiza os níveis deles.</p>
//                 <p>Para acessar o aplicativo, baixe-o na loja <a href='https://apps.apple.com/us/app/id1526683054'>Apple Store</a> ou <a href='https://play.google.com/store/apps/details?id=br.com.mergulho'>Google Play</a></p>";
//             }
//             else
//             {
//                 body += @"<p>Agora você tem acesso ao nosso Mergulho App.</p>
//                 <p>Nele você acompanha as notícias, avisos e suas avaliações, além de enviar sugestões para a nossa equipe.</p>
//                 <p>Para acessar o aplicativo, baixe-o na loja <a href='https://apps.apple.com/us/app/id1526683054'>Apple Store</a> ou <a href='https://play.google.com/store/apps/details?id=br.com.mergulho'>Google Play</a></p>";
//             }

//             body += @"<p>E utilize os dados abaixo:</p>
//             <p>Login: " + obj.Email + @"</p>
//             <p>Senha: " + obj.Password + @"</p>
//             <p>Por segurança, após o primeiro acesso, aconselhamos trocar esta senha</p>
//             <p>Qualquer dúvida estamos a disposição!</p>
//             <p>Abraços,</p>
//             <p>Mergulho Sport Center</p>";

//             EmailUtils emailUtils = new EmailUtils(obj.City_Id);
//             emailUtils.SendEmail("Dados de acesso - Mergulho App", body, obj.Email);
            
//             try
//             {
//                 var rows = await _userRepository.Add(obj);

//                 if (rows == 0)
//                 {
//                     return NoContent();
//                 }

//                 return Ok(rows);
//             }            
//             catch (Exception e)
//             {
//                 return StatusCode(409, e.Message);
//             }
//         }

//         [HttpPost("Login")]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> Login([FromBody] User obj)
//         {
//             var login = await _userRepository.Login(obj);

//             if (login == null)
//             {
//                 return BadRequest();
//             }

//             return Ok(login);
//         }

//         [HttpPost("Email")]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> GetByEmail([FromBody] User obj)
//         {            
//             var user = await _userRepository.GetByEmail(obj);

//             if (user == null)
//             {
//                 return StatusCode(403, "E-mail inválido.");
//             }

//             string newPassword = "";
//             user.Name.Split(" ").ToList().ForEach(i => newPassword += i[0]);
//             user.Password = newPassword + "#" + user.Id;
//             var rows = await _userRepository.UpdateRecoverPassword(user);

//             if (rows == 0)
//             {
//                 return StatusCode(403, "E-mail inválido.");
//             }

//             string body = @"<h3>Olá, " + user.Name + @"!</h3>
//             <p>Foi solicitada uma nova senha no Mergulho App para o seu usuário.</p>
//             <p>Utilize esta nova senha para acessar o aplicativo: <b>" + user.Password + @"</b></p>
//             <p>Ao fazer login, sugerimos que altere a senha.</p>
//             <p>Se você não fez esta solicitação, ignore este e-mail.</p>
//             <p>Atenciosamente,</p>
//             <p>Mergulho Sport Center</p>";

//             EmailUtils emailUtils = new EmailUtils(user.City_Id);
//             emailUtils.SendEmail("Solicitação de redefinição de senha - Mergulho App", body, user.Email);

//             return Ok(user);
//         }

//         [HttpDelete]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> Delete(int id)
//         {
//             var rows = await _userRepository.Delete(id);

//             if (rows == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(rows);
//         }

//         [HttpDelete("Remove")]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> DeleteRemove(int id)
//         {
//             var rows = await _userRepository.DeleteRemove(id);

//             if (rows == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(rows);
//         }

//         [HttpPut]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> Update(User obj)
//         {
//             var rows = await _userRepository.Update(obj);

//             if (rows == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(rows);
//         }

//         [HttpPut("Profile")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> UpdateProfile(User obj)
//         {
//             var rows = await _userRepository.UpdateProfile(obj);

//             if (rows == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(rows);
//         }

//         [HttpPut("Password")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> UpdatePassword(Password obj)
//         {
//             var rows = await _userRepository.UpdatePassword(obj);

//             if (rows == 0)
//             {
//                 return StatusCode(403, "Senha atual inválida.");
//             }

//             return Ok(rows);
//         }

//         [HttpPut("Level")]
//         [Authorize]
//         [Produces(typeof(User))]
//         public async Task<IActionResult> UpdateLevel(User obj)
//         {
//             var rows = await _userRepository.UpdateLevel(obj);

//             if (rows == 0)
//             {
//                 return NoContent();
//             }

//             return Ok(rows);
//         }
//     }
// }
