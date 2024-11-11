using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using YKT.CORE.Helpers;
using YKT_CORE.Helpers;
using YKT_DATOS_CONSULTAS.ADMIN;
using YKT_DATOS_EVENTOS.COMANDOS.ADM.RECOMPENSAS;
using YKT_DATOS_MODELOS.ADMIN;

namespace YAKUBITE.Pages.Admin.Recompensas
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasRecompensas _consultasRecompensas;
    private readonly CloudinaryFile _clodinaryFile;

    public IndexModel(
      IConsultasRecompensas consultasRecompensas,
      IMediator mediator
    )
    {
      _consultasRecompensas = consultasRecompensas;
      _mediator = mediator;
      _clodinaryFile = new CloudinaryFile();
    }

    #region RECOMPENSAS
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAsync([FromQuery] RecompensasModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasRecompensas.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;
        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los usuarios.", error = ex.Message });
      }

    }


    [HttpPost]
    public async Task<IActionResult> OnPostAddAsync([FromForm] ComandoInsertarRecompensa comando)
    {
      try
      {
        if (comando.FILE != null && comando.FILE.Length > 0)
        {
          string publicUrl = await _clodinaryFile.UploadFileAsync(comando.FILE);
          comando.RUTA = publicUrl;
        }

        comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
        var result = await _mediator.Send(comando);

        return new JsonResult(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, "Error interno del servidor: " + ex.Message);
      }
    }


    [HttpPost]
    public async Task<IActionResult> OnPostUpdateAsync([FromForm] ComandoEditarRecompensa comando)
    {
      try
      {
        if (comando.FILE != null && comando.FILE.Length > 0)
        {
          if (!string.IsNullOrEmpty(comando.RUTA))
          {
            //await _clodinaryFile.DeleteFileAsync(comando.RUTA);
          }

          string publicUrl = await _clodinaryFile.UploadFileAsync(comando.FILE);
          comando.RUTA = publicUrl;
        }

        comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
        var result = await _mediator.Send(comando);
        return new JsonResult(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, "Error interno del servidor: " + ex.Message);
      }
    }

    [HttpPost]
    public async Task<IActionResult> OnPostDeleteAsync([FromForm] ComandoEliminarRecompensa comando)
    {
      comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }

    #endregion

  }
}
