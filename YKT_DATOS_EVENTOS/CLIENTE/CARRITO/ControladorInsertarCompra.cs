using Dapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using YKT.CORE.Structs;
using YKT.DATABASE.Helper;
using YKT.DATABASE;
using System.Text.Json;
using YKT_DATOS_EVENTOS.COMANDOS.CLIENTE.CARRITO;

namespace YKT_DATOS_EVENTOS.CLIENTE.CARRITO
{
    public class ControladorInsertarCompra : IRequestHandler<ComandoInsertarCompra, RespuestaConsulta>
    {
        private readonly IConfiguration _configuration;

        public ControladorInsertarCompra(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<RespuestaConsulta> Handle(ComandoInsertarCompra entidad, CancellationToken cancellationToken)
        {
            var parametros = new DynamicParameters();
            var json = JsonSerializer.Serialize(new
            {
                ID = entidad.ID,
                IDCLIENTE = entidad.IDCLIENTE,
                SUBTOTAL = entidad.SUBTOTAL,
                DESCUENTO = entidad.DESCUENTO,
                TOTAL = entidad.TOTAL,
                JSONCARRITO = entidad.JSONCARRITO,
                ESTADO = entidad.ESTADO
            });

            parametros.Add("@p_cData", json);
            parametros.Add("@p_cUser", entidad.USUARIO);
            parametros.Add("@p_nTipo", 1);
            parametros.Add("@p_nId", 0);

            var conexionSql = _configuration.GetConnectionString("DefaultConnection");
            return await FuncionesSql.EjecutarProcedimiento(conexionSql, Procedimientos.CLIENTE.CrudCompra, parametros);
        }
    }
}
