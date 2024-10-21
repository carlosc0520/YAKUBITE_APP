using MediatR;
using Microsoft.AspNetCore.Http;
using YKT.CORE.Structs;
using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_EVENTOS.COMANDOS.ADM.COMUNIDAD
{
    public class ComandoInsertarForo : EntidadAuditoria, IRequest<RespuestaConsulta>
    {
        public string? TITULO { get; set; } = null;
        public string? DESCRIPCION { get; set; } = null;
        public DateTime? FINICIO { get; set; } = null;
        public DateTime? FFIN { get; set; } = null;
        public string? RUTA { get; set; } = null;
        public IFormFile? FILE { get; set; } = null;
    }
}
