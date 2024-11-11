using Dapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using YKT.CORE.Structs;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using YKT_DATOS_EVENTOS.COMANDOS.ADM.RECOMPENSAS;

namespace YKT_DATOS_EVENTOS.ADMIN.RECOMPENSAS
{
    public class ControladorEditarRecompensa : IRequestHandler<ComandoEditarRecompensa, RespuestaConsulta>
    {
        private readonly IConfiguration _configuration;

        public ControladorEditarRecompensa(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<RespuestaConsulta> Handle(ComandoEditarRecompensa entidad, CancellationToken cancellationToken)
        {
            var parametros = new DynamicParameters();
            var json = JsonSerializer.Serialize(new
            {
                ID = entidad.ID,
                NOMBRE = entidad.NOMBRE,
                DESCRIPCION = entidad.DESCRIPCION,
                RUTA = entidad.RUTA,
                CODIGO = entidad.CODIGO,
                PUNTOS = entidad.PUNTOS,
                ESTADO = entidad.ESTADO
            });

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", entidad.USUARIO);
            parametros.Add("@p_nTipo", 1);
            parametros.Add("@p_nId", entidad.ID);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento(conexionSql, Procedimientos.ADMIN.CrudRecompensas, parametros);
        }
    }
}
