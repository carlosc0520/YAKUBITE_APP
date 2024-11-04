using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using YKT.CONFIG;
using YKT.CORE.Helpers;
using YKT.CORE.Structs;
using YKT_DATOS_CONSULTAS.LOGIN;
using YKT_DATOS_EVENTOS.COMANDOS.LOGIN;
using YKT_DATOS_MODELOS.LOGIN;

namespace YAKUBITE.Pages.Auth.Login
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasLogin _consultasLogin;

    public IndexModel(
      IConsultasLogin consultasLogin,
      IMediator mediator
    )
    {
      _consultasLogin = consultasLogin;
      _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> OnGetComboAsync([FromQuery] GDModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasLogin.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;
        return new JsonResult(new { recordsTotal = totalRows, data = datos });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los restaurantes.", error = ex.Message });
      }

    }

    [HttpGet]
    public async Task<IActionResult> OnGetObtenerUserAsync([FromQuery] UsuarioModel custom)
    {
      try
      {
        var usuario = await _consultasLogin.ObtenerUsuario(custom);

        if (usuario == null)
        {
          return BadRequest(new { success = false, message = "Usuario no encontrado." });
        }

        if (string.IsNullOrEmpty(usuario.CORREO) || !IsValidEmail(usuario.CORREO))
        {
          return BadRequest(new { success = false, message = "El correo del usuario es inválido." });
        }

        var identity = new RespuestaConsulta();
        await GenerateToken(usuario, identity);

        var tokenLink = $"http://localhost:7091/Auth/ResetPassword/Index?token={identity.AccessToken}";
        await SendTokenEmail(usuario.CORREO, tokenLink);

        return new JsonResult(new { success = true, message = "Token generado y enviado al correo.", data = identity });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al obtener al usuario.", error = ex.Message });
      }
    }

    private bool IsValidEmail(string email)
    {
      try
      {
        var addr = new System.Net.Mail.MailAddress(email);
        return addr.Address == email;
      }
      catch
      {
        return false;
      }
    }

    private async Task GenerateToken(UsuarioModel user, RespuestaConsulta identity)
    {
      var secretKey = ConfiguracionProyecto.CAPTCHA.SecretKey;
      var key = Encoding.ASCII.GetBytes(secretKey);

      var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
        new Claim(ClaimTypes.Name, user.USUARIO),
    };

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddDays(1),
        SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      var createdToken = tokenHandler.CreateToken(tokenDescriptor);
      identity.AccessToken = tokenHandler.WriteToken(createdToken);
    }

    private async Task SendTokenEmail(string email, string tokenLink)
    {
      try
      {
        var subject = "Restablecimiento de Contraseña";
        var body = $"Por favor ingrese al siguiente enlace para restablecer su contraseña: <a href='{tokenLink}'>Restablecer Contraseña</a>";

        var mailMessage = new MailMessage
        {
          From = new MailAddress("no-reply@yourdomain.com"), 
          Subject = subject,
          Body = body,
          IsBodyHtml = true 
        };
        mailMessage.To.Add(email);

        using (var smtpClient = new SmtpClient("smtp.gmail.com", 587)) 
        {
          smtpClient.Credentials = new NetworkCredential("ccarbajalmt0520@gmail.com", "qcigvfwwdyrwelib");
          smtpClient.EnableSsl = true;

          await smtpClient.SendMailAsync(mailMessage);
        }
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending email: {ex.Message}");
      }
    }



    [HttpPost]
    public async Task<IActionResult> OnPostLoginAsync(ComandoBuscarUsuario comando)
    {
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }
  }
}
