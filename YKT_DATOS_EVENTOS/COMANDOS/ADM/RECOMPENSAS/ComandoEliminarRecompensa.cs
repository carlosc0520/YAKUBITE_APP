using MediatR;
using YKT.CORE.Structs;

namespace YKT_DATOS_EVENTOS.COMANDOS.ADM.RECOMPENSAS
{
    public class ComandoEliminarRecompensa : IRequest<RespuestaConsulta>
    {
        public int? ID { get; set; } = null;
        public string? USUARIO { get; set; } = null;
    }
}
