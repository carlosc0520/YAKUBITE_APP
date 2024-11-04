using Dapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using YKT.CORE.Structs;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using YKT_DATOS_EVENTOS.COMANDOS.LOGIN;

namespace YKT_DATOS_EVENTOS.LOGIN
{
    public class ControladorActualizarContrasena : IRequestHandler<ComandoActualizarContrasena, RespuestaConsulta>
    {
        private readonly IConfiguration _configuration;

        public ControladorActualizarContrasena(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<RespuestaConsulta> Handle(ComandoActualizarContrasena entidad, CancellationToken cancellationToken)
        {
            var parametros = new DynamicParameters();
            var json = JsonSerializer.Serialize(new
            {
                ID = entidad.ID,
                PASSWORD = entidad.PASSWORD,
                ESTADO = entidad.ESTADO
            });

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", entidad.USUARIO);
            parametros.Add("@p_nTipo", 5);
            parametros.Add("@p_nId", entidad.ID);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento(conexionSql, Procedimientos.SEGURIDAD.CrudRegister, parametros);
        }
    }
}