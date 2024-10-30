using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_MODELOS.CLIENTE
{
    public class CompraModel : EntidadAuditoria
    {
        public int? IDCLIENTE { get; set; } = null;
        public decimal? SUBTOTAL { get; set; } = null;
        public decimal? DESCUENTO { get; set; } = null;
        public decimal? TOTAL { get; set; } = null;
        public string? JSONCARRITO { get; set; } = null;
        public string? CLIENTE { get; set; } = null;
        public List<MenuCompraModel>? CARRITO { get; set; } = new List<MenuCompraModel>();

    }

    public class MenuCompraModel : EntidadAuditoria
    {
        public int? IDCOMPRA { get; set; } = null;
        public int? IDPROD { get; set; } = null;
        public decimal? PRECIO { get; set; } = null;
        public int? CANTIDAD { get; set; } = null;
        public string? RUTA { get; set; } = null;
        public string? NOMBRE { get; set; } = null;
    }
}
