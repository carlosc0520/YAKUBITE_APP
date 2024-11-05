using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using YKT.CONFIG;
using YKT.CORE.Helpers;
using YKT_CORE.Helpers;
using YKT_DATOS_CONSULTAS.ADMIN;
using YKT_DATOS_EVENTOS.COMANDOS.ADM.COMUNIDAD;
using YKT_DATOS_MODELOS.ADMIN;

namespace YAKUBITE.Pages.Admin.Comunidad
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasComunidad _consultasComunidad;
    private readonly CloudinaryFile _clodinaryFile;

    public IndexModel(
      IConsultasComunidad consultasComunidad,
      IMediator mediator
    )
    {
      _consultasComunidad = consultasComunidad;
      _mediator = mediator;
      _clodinaryFile = new CloudinaryFile();
    }

    #region COMUNIDAD
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAsync([FromQuery] ComunidadModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasComunidad.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;
        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los foros.", error = ex.Message });
      }

    }

    [HttpGet]
    public async Task<IActionResult> OnGetBuscarForosAsync([FromQuery] ComunidadModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasComunidad.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        custom.ID  = int.Parse(HttpContextDraw.User(HttpContext, 2));
        datos.ForEach(e =>
        {
          e.RESPUESTA = JsonConvert.DeserializeObject<List<ComentarioModel>>(e.RESPUESTAS);
          e.RESPUESTA.ForEach(d =>
          {
            d.ISDELETE = custom.ID == d.IDUSUARIO;
          });

        });

        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los foros.", error = ex.Message });
      }

    }

    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAllAsync([FromQuery] ComentarioModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasComunidad.ListarRespuesta(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;
        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los comentarios.", error = ex.Message });
      }

    }


    [HttpPost]
    public async Task<IActionResult> OnPostAddAsync([FromForm] ComandoInsertarForo comando)
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
    public async Task<IActionResult> OnPostUpdateAsync([FromForm] ComandoEditarForo comando)
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
    public async Task<IActionResult> OnPostDeleteAsync([FromForm] ComandoEliminarForo comando)
    {
      comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }

    #endregion


  }
}
