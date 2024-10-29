using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using YKT.CONFIG;
using YKT.CORE.Helpers;
using YKT_DATOS_CONSULTAS.CLIENTE;
using Newtonsoft.Json;
using YKT_DATOS_MODELOS.CLIENTE;

namespace YAKUBITE.Pages.Cliente.Ordenes
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasCarrito _consultasCarrito;

    public IndexModel(
      IConsultasCarrito consultasCarrito,
      IMediator mediator
    )
    {
      _consultasCarrito = consultasCarrito;
      _mediator = mediator;
    }


    #region CARRITO
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAsync([FromQuery] CompraModel custom)
    {
      try
      {
        custom.IDCLIENTE = int.Parse(HttpContextDraw.User(HttpContext, 2));
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasCarrito.Listar(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        datos.ForEach(e =>
        {
          if (!string.IsNullOrWhiteSpace(e.JSONCARRITO))
          {
            e.CARRITO = JsonConvert.DeserializeObject<MenuCompraModel>(e.JSONCARRITO);
            e.CARRITO.RUTA = Path.Combine(ConfiguracionProyecto.HOST, e.CARRITO.RUTA.Replace("\\", "/"));
          }
        });

        return new JsonResult(new { recordsTotal = totalRows, recordsFiltered = totalRows, data = datos, draw = custom.DRAW });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = "Ocurrió un error al listar los restaurantes.", error = ex.Message });
      }

    }

    #endregion
  }
}
