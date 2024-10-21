/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Admin/Comunidad/Index?handler',
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
            forosCrud.eventos.TABLE();
        },
        globales: () => {
            let dropzoneBasic = $('#AddForo #dropzone-area');
            if (dropzoneBasic) {
                myDropzoneAddForo = new Dropzone(dropzoneBasic[0], {
                    previewTemplate: previewTemplate('imagen'),
                    parallelUploads: 1,
                    maxFilesize: 5,
                    maxFiles: 1,
                    acceptedFiles: 'image/*',
                    init: function () {
                        this.on('addedfile', function (file) {
                            if (this.files.length > 1) {
                                this.removeFile(this.files[0]);
                            }
                        });
                    }
                });
            }

            let dropzoneBasicEdit = $('#EditForo #dropzone-area');
            if (dropzoneBasicEdit) {
                myDropzoneEditForo = new Dropzone(dropzoneBasicEdit[0], {
                    previewTemplate: previewTemplateImage('imagen'),
                    createImageThumbnails: false,
                    parallelUploads: 1,
                    maxFilesize: 5,
                    maxFiles: 1,
                    acceptedFiles: 'image/*',
                    init: function () {
                        this.on('addedfile', async function (file) {
                            if (this.files.length > 1) {
                                this.removeFile(this.files[0]);
                            }

                            dropzoneBasicEdit.find('.centered-image').off('click');
                            dropzoneBasicEdit.find('.dz-preview').css('cursor', 'pointer');

                            let filePreview = this.files[0];
                            if (filePreview.isExist) {
                                let img = dropzoneBasicEdit.find('.dz-preview').find('.dz-details').find('img');
                                img.attr('src', filePreview.dataURL);
                                return;
                            }

                            let reader = new FileReader();
                            reader.readAsDataURL(filePreview);
                            reader.onload = function () {
                                let img = dropzoneBasicEdit.find('.dz-preview').find('.dz-details').find('img');
                                img.attr('src', reader.result);
                                file.dataURL = reader.result;
                                img.on('click', function () {
                                    createModalImage($(this).attr('src'));
                                });
                            };
                        });
                    }
                });
            }

            // * MODALES
            $('#modalAddForo').on('show.bs.modal', function (e) {
                myDropzoneAddForo.removeAllFiles();
                configFormVal('AddForo', forosCrud.validaciones.INSERT, () => forosCrud.eventos.INSERT());
            });

            $('#modalEditForo').on('show.bs.modal', function (e) {
                myDropzoneEditForo.removeAllFiles();
                configFormVal('EditForo', forosCrud.validaciones.UPDATE, () => forosCrud.eventos.UPDATE());
                func.actualizarForm('EditForo', forosCrud.variables.rowEdit);
                agregarArchivoADropzone(forosCrud.variables.rowEdit?.ruta, myDropzoneEditForo);
            });

            //   // * FORMULARIOS
            $(`#${forosTable}`).on('click', '.edit-row-button', function () {
                const data = CforosTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró el foro seleccionado');
                forosCrud.variables.rowEdit = data;
                $('#modalEditForo').modal('show');
            });

            $(`#${forosTable}`).on('click', '.delete-row-button', function () {
                const data = CforosTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró el foro seleccionado');
                swalFire.confirmar('¿Está seguro de eliminar el foro?', {
                    1: () => forosCrud.eventos.DELETE(data.id)
                });
            });

            $(`#${forosTable}`).on('click', '.view-row-button', function () {
                const data = CforosTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró el foro seleccionado');
                forosCrud.variables.rowEdit = data;
                redirect(true, 'navs-respuestas', data.id);
            });
        },
        variables: {
            rowEdit: {}
        },
        eventos: {
            TABLE: () => {
                if (!CforosTable) {
                    CforosTable = $(`#${forosTable}`).DataTable({
                        ...configTable(),
                        ajax: {
                            url: uisApis.API + '=Buscar',
                            type: 'GET',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || null));
                            },
                            data: function (d) {
                                delete d.columns;
                                d.ESTADO = func.obtenerCESTDO(forosTable);
                            }
                        },
                        columns: [
                            { data: 'rn', title: '' },
                            { data: 'titulo', title: 'Titulo' },
                            { data: null, title: "Total Com.", className: 'text-center', render: data => data.total || 0 },
                            {
                                data: null,
                                title: 'Estado',
                                className: 'text-center',
                                render: data => {
                                    return `<span><i class="fa fa-circle ${data.estado == 'A' ? 'text-success' : 'text-danger'}" title=${data.estado == 'A' ? 'Activo' : 'Inactivo'
                                        }></i></span>`;
                                }
                            },
                            { data: 'usuarioe', title: 'U. Edición' },
                            { data: null, title: 'F. Edición', render: data => func.formatFecha(data.fedicion, 'DD-MM-YYYY HH:mm a') },
                            {
                                data: null,
                                title: '',
                                className: 'text-center',
                                render: data => {
                                    return `<div class="d-flex justify-content-center m-0 p-0">
                        <button name="EDITAR" class="btn btn-sm btn-icon edit-row-button" title="Editar"><i class="bx bx-edit"></i></button>
                        <button name="ELIMINAR" class="btn btn-sm btn-icon delete-row-button" title="Eliminar"><i class="bx bx-trash"></i></button>
                        <button name="VER" class="btn btn-sm btn-icon view-row-button" title="Ver"><i class="bx bx-show"></i></button>
                     </div>`;
                                }
                            }
                        ],
                        initComplete: function (settings, json) {
                            if ($(`#${forosTable}`).find('.radio-buttons').length == 0) {
                                $(`#${forosTable}_filter`).append(select_estados);

                                $(`#${forosTable}_filter .radio-buttons #radioGroup_estado`).on('change', function () {
                                    $(`#${forosTable}`).DataTable().ajax.reload();
                                });
                            }
                        },
                        columnDefs: [],
                        buttons: (() => {
                            let buttons = [];

                            buttons.unshift({
                                text: '<i class="bx bx-plus me-0 me-md-2"></i><span class="d-none d-md-inline-block">Agregar</span>',
                                className: 'btn btn-label-primary btn-add-new',
                                action: function (e, dt, node, config) {
                                    $('#modalAddForo').modal('show');
                                }
                            });

                            return buttons;
                        })()
                    });
                } else {
                    CforosTable.ajax.reload();
                }
            },
            INSERT: () => {
                let file = myDropzoneAddForo?.files?.[0]; 
                let formData = new FormData();
                formData.append('TITULO', $('#AddForo #TITULO').val());
                formData.append('DESCRIPCION', $('#AddForo #DESCRIPCION').val());
                formData.append('FINICIO', $('#AddForo #FINICIO').val());
                formData.append('FFIN', $('#AddForo #FFIN').val());
                formData.append('FILE', file || "");
                formData.append('ESTADO', $('#AddForo #ESTADO').val());

                swalFire.cargando(['Espere un momento', 'Estamos registrando el foro']);
                $.ajax({
                    url: uisApis.API + '=Add',
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
                            swalFire.success('Foro registrado correctamente', '', {
                                1: () => {
                                    $('#modalAddForo').modal('hide');
                                    CforosTable.ajax.reload();
                                }
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al agregar el foro')
                });
            },
            UPDATE: () => {

                let file = myDropzoneEditForo.files[0];
                if (!file) return swalFire.error('Debe seleccionar una imagen');

                let formData = new FormData();
                formData.append('ID', forosCrud.variables.rowEdit.id);
                formData.append('TITULO', $('#EditForo #TITULO').val());
                formData.append('DESCRIPCION', $('#EditForo #DESCRIPCION').val());
                formData.append('FINICIO', $('#EditForo #FINICIO').val());
                formData.append('FFIN', $('#EditForo #FFIN').val());
                formData.append('FILE', file?.isExist ? null : file);
                formData.append('RUTA', forosCrud.variables.rowEdit.ruta);
                formData.append('ESTADO', $('#EditForo #ESTADO').val());

                swalFire.cargando(['Espere un momento', 'Estamos actualizando el foro']);
                $.ajax({
                    url: uisApis.API + '=Update',
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
                            swalFire.success('foro actualizado correctamente', '', {
                                1: () => {
                                    $('#modalEditForo').modal('hide');
                                    CforosTable.ajax.reload();
                                }
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al actualizar el foro')
                });
            },
            DELETE: id => {
                let formData = new FormData();
                formData.append('ID', id);

                swalFire.cargando(['Espere un momento', 'Estamos eliminando el foro']);
                $.ajax({
                    url: uisApis.API + '=Delete',
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
                            swalFire.success('foro eliminado correctamente', '', {
                                1: () => $(`#${forosTable}`).DataTable().ajax.reload()
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al eliminar el foro')
                });
            }
        },
        formularios: {},
        validaciones: {
            INSERT: {
                TITULO: agregarValidaciones({
                    required: true,
                }),
                DESCRIPCION: agregarValidaciones({
                    required: true
                }),
                FINICIO: agregarValidaciones({
                    required: true
                }),
                FFIN: agregarValidaciones({
                    required: true
                }),
            },
            UPDATE: {
                TITULO: agregarValidaciones({
                    required: true,
                }),
                DESCRIPCION: agregarValidaciones({
                    required: true
                }),
                FINICIO: agregarValidaciones({
                    required: true
                }),
                FFIN: agregarValidaciones({
                    required: true
                }),
            }
        }
    };

    const respuestasCrud = {
        init: () => {
            respuestasCrud.eventos.TABLE();
        },
        globales: () => {
            $(`#${respuestasTable}`).on('click', '.delete-row-button', function () {
                const data = CrespuestasTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró el menu seleccionado');
                swalFire.confirmar('¿Está seguro de eliminar el menu?', {
                    1: () => respuestasCrud.eventos.DELETE(data.id)
                });
            });
        },
        variables: {
            rowEdit: {}
        },
        eventos: {
            TABLE: () => {
                $(`#${respuestasTable}_title`).text('FORO: ' + forosCrud.variables.rowEdit?.titulo);

                if (!CrespuestasTable) {
                    CrespuestasTable = $(`#${respuestasTable}`).DataTable({
                        ...configTable(),
                        ajax: {
                            url: uisApis.API + '=BuscarAll',
                            type: 'GET',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || null));
                            },
                            data: function (d) {
                                delete d.columns;
                                d.IDFORO = forosCrud.variables.rowEdit.id;
                                d.CESTDO = func.obtenerCESTDO(respuestasTable);
                            }
                        },
                        columns: [
                            { data: 'rn', title: '' },
                            { data: 'usuario', title: 'Usuario' },
                            { data: 'texto', title: 'Comentario' },
                            {
                                data: null,
                                title: 'Estado',
                                className: 'text-center',
                                render: data => {
                                    return `<span><i class="fa fa-circle ${data.estado == 'A' ? 'text-success' : 'text-danger'}" title=${data.estado == 'A' ? 'Activo' : 'Inactivo'
                                        }></i></span>`;
                                }
                            },
                            { data: 'usuarioe', title: 'U. Edición' },
                            { data: null, title: 'F. Edición', render: data => func.formatFecha(data.fedicion, 'DD-MM-YYYY HH:mm a') },
                            {
                                data: null,
                                title: '',
                                className: 'text-center',
                                render: data => {
                                    return `<div class="d-flex justify-content-center m-0 p-0">
                                    <button name="ELIMINAR" class="btn btn-sm btn-icon delete-row-button" title="Eliminar"><i class="bx bx-trash"></i></button>
                                </div>`;
                                }
                            }
                        ],
                        initComplete: function (settings, json) {
                            if ($(`#${respuestasTable}`).find('.radio-buttons').length == 0) {
                                $(`#${respuestasTable}_filter`).append(select_estados);

                                $(`#${respuestasTable}_filter .radio-buttons #radioGroup_estado`).on('change', function () {
                                    $(`#${respuestasTable}`).DataTable().ajax.reload();
                                });
                            }
                        },
                        columnDefs: [],
                        buttons: (() => {
                            let buttons = [];

                            return buttons;
                        })()
                    });
                } else {
                    CrespuestasTable.ajax.reload();
                }
            },
            DELETE: id => {
                let formData = new FormData();
                formData.append('ID', id);

                swalFire.cargando(['Espere un momento', 'Estamos eliminando el menu']);
                $.ajax({
                    url: uisApis.API + '=DeleteMenu',
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
                            swalFire.success('Menu eliminado correctamente', '', {
                                1: () => $(`#${respuestasTable}`).DataTable().ajax.reload()
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al eliminar el menu')
                });
            }
        },
        formularios: {},
        validaciones: {}
    };

    const globales = {
        init: () => {
            globales.eventos.selects();
        },
        eventos: {
            selects: () => {
                let selects = [];

                if (selects.length === 0) return;

                selects.forEach(selectAll => {
                    $.ajax({
                        url: uisApis.GD + '=Combo&GD=' + selectAll,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                        },
                        type: 'GET',
                        success: function (response) {
                            if (response?.data) {
                                let select = document.querySelectorAll(`select[name=${selectAll}]`);

                                select.forEach(s => {
                                    s.innerHTML = `<option value="">-- Seleccione</option>`;
                                    response.data.forEach(d => {
                                        s.innerHTML += `<option value="${d.value}">${d.label}</option>`;
                                    });
                                });
                            }
                        },
                        error: error => swalFire.error('Ocurrió un error al cargar los módulos')
                    });
                });
            }
        }
    }
    
    return {
        init: async () => {
            await globales.init();
            await func.limitarCaracteres();

            forosCrud.init();
            forosCrud.globales();
            respuestasCrud.globales();

            var myTabs = document.querySelectorAll('.nav-tabs button');
            myTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    const tabPane = tab.getAttribute('data-bs-target');
                    if (tabPane === '#navs-foros') {
                        redirect(false, 'navs-respuestas', 0);
                        forosCrud.eventos.TABLE();
                    }

                    if (tabPane === '#navs-respuestas') {
                        respuestasCrud.eventos.TABLE();
                    }
                });
            });


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
