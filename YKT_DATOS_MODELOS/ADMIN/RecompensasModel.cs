using YKT.ENTIDAD.Modelo.Auditoria;

namespace YKT_DATOS_MODELOS.ADMIN
{
    public class RecompensasModel : EntidadAuditoria
    {
        public string? NOMBRE { get; set; } = null;
        public string? DESCRIPCION { get; set; } = null;
        public string? RUTA { get; set; } = null;
        public string? CODIGO { get; set; } = null;
        public int? PUNTOS { get; set; } = null;
    }
}
