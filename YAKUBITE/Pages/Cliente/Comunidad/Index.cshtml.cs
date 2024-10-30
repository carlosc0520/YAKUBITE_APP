using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using YKT.CORE.Helpers;
using YKT_DATOS_EVENTOS.COMANDOS.ADM.RESTAURANT;
using YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.COMUNIDAD;

namespace YAKUBITE.Pages.Cliente.Comunidad
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
    public async Task<IActionResult> OnPostAddAsync([FromForm] ComandoInsertarComentario comando)
    {
      try
      {
        comando.IDUSUARIO = int.Parse(HttpContextDraw.User(HttpContext, 2));
        var result = await _mediator.Send(comando);
        return new JsonResult(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, "Error interno del servidor: " + ex.Message);
      }
    }

    [HttpPost]
    public async Task<IActionResult> OnPostDeleteAsync([FromForm] ComandoEliminarComentario comando)
    {
      comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }

  }
}
