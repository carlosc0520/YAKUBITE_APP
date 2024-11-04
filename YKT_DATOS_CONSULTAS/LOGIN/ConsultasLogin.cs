using Dapper;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using YKT_DATOS_MODELOS.LOGIN;

namespace YKT_DATOS_CONSULTAS.LOGIN
{
    public interface IConsultasLogin
    {
        Task<List<GDModel>> Listar(GDModel custom);
        Task<UsuarioModel> ObtenerUsuario(UsuarioModel custom);

    }
    public class ConsultasLogin : IConsultasLogin
    {
        private readonly IConfiguration _configuration;

        public ConsultasLogin(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<GDModel>> Listar(GDModel custom)
        {
            var parametros = new DynamicParameters();

            var json = JsonSerializer.Serialize(new
            {
                DESC = custom.DESC,
                ESTADO = custom.ESTADO,
                INIT = custom.INIT,
                ROWS = custom.ROWS,
                AGRUPADOR = custom.GD
            }).ToUpper();

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", null);
            parametros.Add("@p_nTipo", 5);
            parametros.Add("@p_nId", custom.ID ?? 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento<GDModel>(conexionSql, Procedimientos.SEGURIDAD.CrudCombos, parametros);
        }

        public async Task<UsuarioModel> ObtenerUsuario(UsuarioModel custom)
        {
            var parametros = new DynamicParameters();
            var json = JsonSerializer.Serialize(new
            {
                USUARIO = custom.USUARIO,
                ROWS = 1,
                INIT = 0,
                CESTDO = 'A'
            });

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", null);
            parametros.Add("@p_nTipo", 4);
            parametros.Add("@p_nId", 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            var result =  await FuncionesSql.EjecutarProcedimiento<UsuarioModel>(conexionSql, Procedimientos.SEGURIDAD.CrudRegister, parametros);
            return result.FirstOrDefault();
        
        }
    }
}
