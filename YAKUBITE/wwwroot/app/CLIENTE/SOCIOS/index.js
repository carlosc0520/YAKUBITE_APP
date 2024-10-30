/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Admin/Restaurant/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };

    // * VARIABLES

    // * TABLAS
    const sociosCrud = {
        init: () => {
            sociosCrud.eventos.OBTENER();
        },
        globales: () => {
            
        },
        variables: {
            rowEdit: {},
            categorias: [],
            data: []
        },
        eventos: {
            OBTENER: async () => {
                swalFire.cargando(['Espere un momento', 'Estamos obteniendo la información']);

                await $.ajax({
                    url: uisApis.GD + '=Combo&GD=' + 'CATEGORIAGD',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                    },
                    type: 'GET',
                    success: function (response) {
                        if (response?.data && response?.data.length > 0) {
                            sociosCrud.variables.categorias = response.data;
                        }else{
                            sociosCrud.variables.categorias = [];    
                        }
                    },
                    error: error => swalFire.error('Ocurrió un error al cargar los datos')
                });


                await $.ajax({
                    url: uisApis.API + '=BuscarAll&ESTADO=A&start=0&length=10000',
                    type: 'GET',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || null));
                    },
                    success: function (response) {
                        if (response?.data && response?.data.length > 0) {
                            sociosCrud.variables.data = response.data;
                        }
                        swalFire.cerrar();
                    },
                    error: error => swalFire.error('Ocurrió un error al cargar los datos')
                });

                let container = $("#landingTeam");
                container.html('');

                sociosCrud.variables.categorias.forEach((item, index1) => {
                    let empresasCat = sociosCrud.variables.data.filter(x => x.categoriagd === item.value);
                    let html = '';
                    empresasCat.forEach((empresa, index2) => {
                        html += `
                        <div class="col-lg-3 col-sm-6">
                            <div class="card mt-3 mt-lg-0 shadow-none">
                                <div class="rounded position-relative team-image-box">
                                        <img class="position-absolute card-img-position bottom-0 start-50 scaleX-n1-rtl img-fluid" alt="${empresa.alias}" 
                                        src="${empresa.ruta}"
                                        onerror="this.src='https://placehold.co/600x340';" 
                                        data-app-light-img="illustrations/sitting-girl-with-laptop-light.png" 
                                        data-app-dark-img="illustrations/sitting-girl-with-laptop-dark.png" />
                                </div>
                                <div class="card-body border border-label-primary border-top-0 text-center">
                                    <h5 class="card-title mb-0">${empresa.alias}</h5>
                                </div>
                            </div>
                        </div>
                        `;
                    });

                    container.append(`
                        <div class="container ${index1 > 0 ? 'mt-5' : ''}">
                            <h3 class="text-center mb-1"><span class="section-title">${item.label}</span></h3>
                            <div class="row gy-5 mt-5">
                                ${html}
                            </div>
                        </div>
                    `);
                });


            }
        },
        formularios: {},
        validaciones: {}
    };

    return {
        init: async () => {
            sociosCrud.init();
            sociosCrud.globales();

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
