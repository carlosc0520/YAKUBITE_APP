using Dapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using YKT.CORE.Structs;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using System.Text.Json;
using YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.COMUNIDAD;

namespace YKT_DATOS_EVENTOS.CLIENTE.COMUNIDAD
{
    public class ControladorInsertarComentario : IRequestHandler<ComandoInsertarComentario, RespuestaConsulta>
    {
        private readonly IConfiguration _configuration;

        public ControladorInsertarComentario(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<RespuestaConsulta> Handle(ComandoInsertarComentario entidad, CancellationToken cancellationToken)
        {
            var parametros = new DynamicParameters();
            var json = JsonSerializer.Serialize(new
            {
                ID = entidad.ID,
                IDUSUARIO = entidad.IDUSUARIO,
                IDFORO = entidad.IDFORO,
                TEXTO = entidad.TEXTO,
                ESTADO = "A"
            });

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", entidad.USUARIO);
            parametros.Add("@p_nTipo", 1);
            parametros.Add("@p_nId", 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento(conexionSql, Procedimientos.CLIENTE.CrudComentario, parametros);
        }
    }
}
