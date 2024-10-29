using Dapper;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using YKT_DATOS_MODELOS.CLIENTE;

namespace YKT_DATOS_CONSULTAS.CLIENTE
{
    public interface IConsultasCarrito
    {
        Task<List<CompraModel>> Listar(CompraModel custom);

    }
    public class ConsultasCarrito : IConsultasCarrito
    {
        private readonly IConfiguration _configuration;

        public ConsultasCarrito(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<CompraModel>> Listar(CompraModel custom)
        {
            var parametros = new DynamicParameters();

            var json = JsonSerializer.Serialize(new
            {
                DESC = custom.DESC,
                ESTADO = custom.ESTADO,
                INIT = custom.INIT,
                ROWS = custom.ROWS,
                IDCLIENTE = custom.IDCLIENTE
            }).ToUpper();

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", null);
            parametros.Add("@p_nTipo", 4);
            parametros.Add("@p_nId", custom.ID ?? 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento<CompraModel>(conexionSql, Procedimientos.CLIENTE.CrudCompra, parametros);
        }
    }
}

