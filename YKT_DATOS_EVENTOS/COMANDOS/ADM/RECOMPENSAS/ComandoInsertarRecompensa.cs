using MediatR;
using Microsoft.AspNetCore.Http;
using YKT.CORE.Structs;
using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_EVENTOS.COMANDOS.ADM.RECOMPENSAS
{
    public class ComandoInsertarRecompensa : EntidadAuditoria, IRequest<RespuestaConsulta>
    {
        public string? NOMBRE { get; set; } = null;
        public string? DESCRIPCION { get; set; } = null;
        public string? RUTA { get; set; } = null;
        public string? CODIGO { get; set; } = null;
        public IFormFile? FILE { get; set; } = null;
        public int? PUNTOS { get; set; } = null;

    }
}
