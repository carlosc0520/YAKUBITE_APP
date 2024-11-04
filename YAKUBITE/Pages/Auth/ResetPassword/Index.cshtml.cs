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

namespace YAKUBITE.Pages.Auth.ResetPassword
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;

    public IndexModel(
      IMediator mediator
    )
    {
      _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> OnPostRecoveryAsync(ComandoActualizarContrasena comando)
    {
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }
  }
}
