using MediatR;
using YKT.CORE.Structs;
using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.CARRITO
{
    public class ComandoInsertarCompra : EntidadAuditoria, IRequest<RespuestaConsulta>
    {
        public int? IDCLIENTE { get; set; } = null;
        public double? SUBTOTAL { get; set; } = null;
        public double? DESCUENTO { get; set; } = null;
        public double? TOTAL { get; set; } = null;
        public string? JSONCARRITO { get; set; } = null;

    }
}
