/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Admin/Comunidad/Index?handler',
        API2: '/Cliente/Comunidad/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };

    // * VARIABLES
    let forosTable = 'forosTable';
    let respuestasTable = 'respuestasTable';
    let CforosTable = null;
    let CrespuestasTable = null;

    // * files
    let myDropzoneAddForo = null;
    let myDropzoneEditForo = null;

    // * TABLAS
    const forosCrud = {
        init: () => {
            forosCrud.eventos.obtenerForos();
        },
        globales: () => {
            $("#btnAddComentario").on('click', async function (e) {
                e.preventDefault();
                let TEXTO = $('#AddComentario #TEXTO').val().trim();
                if (!TEXTO) return swalFire.warning('Ingrese un comentario');

                let data = {
                    IDFORO: forosCrud.variables.rowEdit.IDFORO,
                    TEXTO: TEXTO
                };

                let formData = new FormData();
                formData.append('IDFORO', data.IDFORO);
                formData.append('TEXTO', data.TEXTO);

                swalFire.cargando(['Espere un momento', 'Estamos guardando la información']);
                $.ajax({
                    url: uisApis.API2 + '=Add',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                    },
                    type: 'POST',
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (data) {
                        if (data?.codEstado > 0) {

                            $('#AddComentario #TEXTO').val('');
                            forosCrud.variables.rowEdit = {};
                            $('#modalAddComentario').modal('hide');
                            forosCrud.eventos.obtenerForos();

                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al agregar el foro')
                });

            });

        },
        variables: {
            rowEdit: {},
            data: []
        },
        eventos: {
            obtenerForos: () => {
                swalFire.cargando(['Espere un momento', 'Estamos obteniendo la información']);

                $.ajax({
                    url: uisApis.API + '=BuscarForos&ESTADO=A&start=0&length=10000',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                    },
                    type: 'GET',
                    success: response => {
                        if (response?.data && response?.data.length > 0) {
                            let data = response.data;
                            forosCrud.variables.data = data;
                            forosCrud.eventos.createAcordiones(data);
                            swalFire.cerrar();
                        } else {
                            forosCrud.eventos.createAcordiones([]);
                            swalFire.cerrar();
                        }
                    },
                    error: error => swalFire.error('Ocurrió un error al cargar los datos')
                });
            },
            createAcordiones: data => {
                let container = $('#accordionStyle1');
                container.html('');

                let html = '';

                
                if(data.length === 0){
                    html = `<div class="alert alert-warning" role="alert">
                                No se encontraron foros
                            </div>`;
                    container.html(html);
                    return;
                }

                data.forEach((item, index) => {
                    html += `<div class="accordion-item card">
                                <h2 class="accordion-header">
                                    <button type="button" class="accordion-button collapsed d-flex justify-content-center align-items-center gap-3" data-bs-toggle="collapse" 
                                    data-bs-target="#accordionStyle-${item.id}" aria-expanded="false">
                                        <img alt="${item.titulo}" 
                                        src="${item.ruta}"
                                        onerror="this.src='https://placehold.co/50x50';" />
                                        <p>${item.titulo}</p>
                                    </button>
                                </h2>

                                <div id="accordionStyle-${item.id}" class="accordion-collapse collapse" data-bs-parent="#accordionStyle-${item.id}">
                                    <div class="accordion-body">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <button class="btn btn-primary btn-create" data-id="${item.id}">
                                            Crear <i class="bx bx-plus"></i>
                                            </button>
                                        </div>
                                        <ul id="foro-${item.id}">
                                            ${(item.respuesta.length > 0) ?
                            item.respuesta.map((respuesta, index) => {
                                return `<li class="list-group-item mb-3 d-flex justify-content-between align-items-center gap-4">
                                                            <div class="d-flex gap-3 align-items-center">
                                                                <img alt="${respuesta.id}" 
                                                                    src="${respuesta.druta}"
                                                                    class="rounded-circle"
                                                                    onerror="this.src='https://placehold.co/50x50';"
                                                                    style="width: 50px; height: 50px; object-fit: cover;" />
                                                                <p class="mb-0">${respuesta.dusuario}</p>
                                                                <p class="mb-0">${respuesta.texto}</p>
                                                            </div>
                                                            ${
                                                                !respuesta.isdelete ? "" :
                                                                `<button class="btn btn-danger btn-sm btn-delete" data-id="${respuesta.id}">
                                                                    <i class="bx bx-trash"></i>
                                                                </button>`
                                                            }
                                                        </li>
                                                        `;
                            }).join('') :
                            '<li class="list-group-item d-flex justify-content-center align-items-center">No se encontraron respuestas</li>'
                        }
                                        </ul>
                                    </div>
                                </div>
                            </div>`;
                });

                container.html(html);
                // * EVENTOS
                $('.btn-create').on('click', async function () {
                    let id = $(this).data('id');
                    forosCrud.variables.rowEdit = {
                        IDFORO: id
                    }
                    $("#modalAddComentario").modal('show');
                });

                $('.btn-delete').on('click', async function () {
                    let id = $(this).data('id');
                    
                    swalFire.confirmar('¿Está seguro de eliminar el comentario?', {
                        1: () =>{
                            let formData = new FormData();
                            formData.append('ID', id);

                            swalFire.cargando(['Espere un momento', 'Estamos eliminando la información']);
                            $.ajax({
                                url: uisApis.API2 + '=Delete',
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                                },
                                type: 'POST',
                                dataType: 'json',
                                contentType: false,
                                processData: false,
                                data: formData,
                                success: function (data) {
                                    if (data?.codEstado > 0) {
                                        swalFire.success('Comentario eliminado correctamente', '', {
                                            1: () => {
                                                forosCrud.variables.rowEdit = {};
                                                forosCrud.eventos.obtenerForos();
                                            }
                                        });
                                    }
            
                                    if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                                },
                                error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al eliminar el foro')
                            });
                        }
                    });
                });
            }
        },
        formularios: {},
        validaciones: {}
    };


    return {
        init: async () => {
            await func.limitarCaracteres();

            forosCrud.init();
            forosCrud.globales();

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
