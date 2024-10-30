using MediatR;
using YKT.CORE.Structs;
using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.COMUNIDAD
{
    public class ComandoInsertarComentario : EntidadAuditoria, IRequest<RespuestaConsulta>
    {
        public int? IDUSUARIO { get; set; } = null;
        public int? IDFORO { get; set; } = null;
        public string? TEXTO { get; set; } = null;
    }
}
