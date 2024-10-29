using MediatR;
using YKT.CORE.Structs;

namespace YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.CARRITO
{
    public class ComandoEliminarCompra : IRequest<RespuestaConsulta>
    {
        public int? ID { get; set; } = null;
        public string? USUARIO { get; set; } = null;
    }
}
