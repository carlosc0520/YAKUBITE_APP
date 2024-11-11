/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Admin/Recompensas/Index?handler',
        USU: '/Admin/Usuarios/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };


    // * TABLAS
    const perfilCrud = {
        init: () => {
            perfilCrud.eventos.OBTENERUSUARIO();
        },
        globales: () => {
   
        },
        variables: {
            rowEdit: {}
        },
        eventos: {
            OBTENERUSUARIO: () => {
                const obtenerUsuario = () =>
                    new Promise((resolve, reject) => {
                        $.ajax({
                            url: uisApis.USU + '=Obtener&length=1&start=0',
                            type: 'GET',
                            success: data => {
                                if (data?.data && data?.data.length > 0) {
                                    perfilCrud.eventos.CREAR(data.data[0]);
                                }
                                resolve();
                            },
                            error: error => {
                                swalFire.error("Ocurrió un error al obtener los datos del usuario");
                                reject(error);
                            }
                        });
                    });
            
                const obtenerRecompensas = () =>
                    new Promise((resolve, reject) => {
                        $.ajax({
                            url: uisApis.API + '=Buscar&length=10000&start=0',
                            type: 'GET',
                            success: data => {
                                perfilCrud.eventos.CREARCARD(data?.data || []);
                                
                                resolve();
                            },
                            error: error => {
                                swalFire.error("Ocurrió un error al obtener las recompensas");
                                reject(error);
                            }
                        });
                    });
            
                swalFire.cargando(['Espere un momento', 'Estamos cargando la información']);
                return obtenerUsuario()
                    .then(() => obtenerRecompensas())
                    .catch(error => swalFire.error("Ocurrió un error al obtener los datos"))
                    .finally(() => swalFire.cerrar());
            },            
            CREAR: async (datos) => {
                $("#NOMBRE_USER").text((datos?.nombres || '') + ' ' + (datos?.apellidos || '').toUpperCase());
                $("#PERFIL_USER").text(datos.rol == "1" ? "Administrador" : "Cliente");
                $("#EMAIL_USER").text(datos?.correo || '');
                $("#TELEFONO_USER").text(datos?.telefono || '');
                $("#IMG_USER").attr('src', datos?.ruta);
            },
            CREARCARD: async (datos) => {
                let contenedor = $("#contenedor-recompensas");
                contenedor.html('');

                if(datos.length === 0) {
                    contenedor.append(`
                        <div class="col-12">
                            <div class="alert alert-warning" role="alert">
                                No se encontraron recompensas
                            </div>
                        </div>
                    `);
                    return;
                }
                
                datos.forEach((item, index) => {
                    contenedor.append(`
                        <div class="col-xl-4 col-lg-6 col-md-6">
                            <div class="card card-recompensas">
                                <img src="${item.ruta}" class="card-img-top" alt="..." width="100%" height="300px">
                                <div class="card-body">
                                    <h5 class="card-title">${item.nombre}</h5>
                                    <p class="card-text">${item.descripcion}</p>
                                    <p class="card-text">Código: ${item.codigo}</p>
                                    <p class="card-text">Puntos necesarios: ${item?.puntos || 0}</p>
                                </div>
                            </div>
                        </div>
                    `);

                    if(index === datos.length - 1) {
                        setTimeout(() => {
                            $('.card-recompensas').addClass('animate__animated animate__fadeInUp');
                        }, 100);
                    }

                });


            }
        },
        formularios: {},
        validaciones: {
    
        }
    };

    return {
        init: async () => {
            await func.limitarCaracteres();

            perfilCrud.init();
            perfilCrud.globales();

            setTimeout(() => {
                $('.dataTables_filter .form-control').removeClass('form-control-sm');
                $('.dataTables_length .form-select').removeClass('form-select-sm');
                $('.dt-buttons').addClass('d-flex align-items-center gap-3 gap-md-0');
            }, 300);
        }
    };
};



executeView().init();

// const useContext = async () => {
//   $.ajax({
//     url: '/Login/Index?handler=Validate&accessToken=' + localStorage.getItem('accessToken'),
//     type: 'GET',
//     success: data => (data?.success ? executeView().init() : (window.location.href = '/Login')),
//     error: error => (window.location.href = '/Login')
//   });
// };

// useContext();
