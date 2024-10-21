using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using YKT.CONFIG;
using YKT.CORE.Helpers;
using YKT_DATOS_CONSULTAS.ADMIN;
using YKT_DATOS_MODELOS.ADMIN;

namespace YAKUBITE.Pages.Cliente.Tienda
{
  [IgnoreAntiforgeryToken(Order = 1001)]

  public class IndexModel : PageModel
  {
    private readonly IMediator _mediator;
    private readonly IConsultasRestaurant _consultasRestaurant;

    public IndexModel(
      IConsultasRestaurant consultasRestaurant,
      IMediator mediator
    )
    {
      _consultasRestaurant = consultasRestaurant;
      _mediator = mediator;
    }

    #region RESTAURANT
    [HttpGet]
    public async Task<IActionResult> OnGetBuscarAllAsync([FromQuery] RestaurantModel custom)
    {
      try
      {
        HttpContextDraw.SetModelValues(HttpContext, custom);
        var datos = await _consultasRestaurant.ListarAll(custom);
        var totalRows = datos?.FirstOrDefault()?.TOTALROWS ?? 0;

        datos.ForEach(e =>
        {
          e.RUTA = Path.Combine(ConfiguracionProyecto.HOST, e.RUTA.Replace("\\", "/"));
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
