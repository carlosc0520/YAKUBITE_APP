using CARO.CORE;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using YKT.CONFIG;
using YKT.CORE.Helpers;
using YKT_CORE.Helpers;
using YKT_DATOS_CONSULTAS.ADMIN;
using YKT_DATOS_EVENTOS.COMANDOS.ADM.RESTAURANT;
using YKT_DATOS_MODELOS.ADMIN;

namespace YAKUBITE.Pages.Admin.Restaurant
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasRestaurant _consultasRestaurant;
    private readonly CloudinaryFile _clodinaryFile;

    public IndexModel(
      IConsultasRestaurant consultasRestaurant,
      IMediator mediator
    )
    {
      _consultasRestaurant = consultasRestaurant;
      _mediator = mediator;
      _clodinaryFile = new CloudinaryFile();
    }

    #region RESTAURANT
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAsync([FromQuery] RestaurantModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasRestaurant.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los restaurantes.", error = ex.Message });
      }

    }

    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAllAsync([FromQuery] RestaurantModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasRestaurant.ListarAll(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los restaurantes.", error = ex.Message });
      }

    }

    [HttpPost]
    public async Task<IActionResult> OnPostAddAsync([FromForm] ComandoInsertarRestaurant comando)
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
    public async Task<IActionResult> OnPostUpdateAsync([FromForm] ComandoEditarRestaurant comando)
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
    public async Task<IActionResult> OnPostDeleteAsync([FromForm] ComandoEliminarRestaurant comando)
    {
      comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }

    #endregion


    #region MENU
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarMenuAsync([FromQuery] MenuModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasRestaurant.ListarMenu(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los menus.", error = ex.Message });
      }

    }

    [HttpPost]
    public async Task<IActionResult> OnPostAddMenuAsync([FromForm] ComandoInsertarMenu comando)
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
    public async Task<IActionResult> OnPostUpdateMenuAsync([FromForm] ComandoEditarMenu comando)
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
    public async Task<IActionResult> OnPostDeleteMenuAsync([FromForm] ComandoEliminarMenu comando)
    {
      comando.USUARIO = HttpContextDraw.User(HttpContext, 1);
      var result = await _mediator.Send(comando);
      return new JsonResult(result);
    }

    #endregion
  }
}
