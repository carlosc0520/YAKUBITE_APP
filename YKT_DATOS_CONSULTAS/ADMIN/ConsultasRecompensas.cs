using Dapper;
using Microsoft.Extensions.Configuration;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using YKT_DATOS_MODELOS.ADMIN;
using System.Text.Json;


namespace YKT_DATOS_CONSULTAS.ADMIN
{
    public interface IConsultasRecompensas
    {
        Task<List<RecompensasModel>> Listar(RecompensasModel custom);

    }
    public class ConsultasRecompensas : IConsultasRecompensas
    {
        private readonly IConfiguration _configuration;

        public ConsultasRecompensas(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<RecompensasModel>> Listar(RecompensasModel custom)
        {
            var parametros = new DynamicParameters();

            var json = JsonSerializer.Serialize(new
            {
                DESC = custom.DESC,
                ESTADO = custom.ESTADO,
                INIT = custom.INIT,
                ROWS = custom.ROWS,
                ID = custom.ID
            }).ToUpper();

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", null);
            parametros.Add("@p_nTipo", 4);
            parametros.Add("@p_nId", custom.ID ?? 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento<RecompensasModel>(conexionSql, Procedimientos.ADMIN.CrudRecompensas, parametros);
        }
    }
}
