/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Admin/Recompensas/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };

    // * VARIABLES
    let recompensaTable = 'recompensaTable';
    let CrecompensaTable = null;

    // * files
    let myDropzoneAddRecompensa = null;
    let myDropzoneEdiRecompensa = null;

    // * TABLAS
    const recompensaCrud = {
        init: () => {
            recompensaCrud.eventos.TABLE();
        },
        globales: () => {
            let dropzoneBasic = $('#AddRecompensa #dropzone-area');
            if (dropzoneBasic) {
                myDropzoneAddRecompensa = new Dropzone(dropzoneBasic[0], {
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

            let dropzoneBasicEdit = $('#EditRecompensa #dropzone-area');
            if (dropzoneBasicEdit) {
                myDropzoneEdiRecompensa = new Dropzone(dropzoneBasicEdit[0], {
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
            $('#modalAddRecompensa').on('show.bs.modal', function (e) {
                myDropzoneAddRecompensa.removeAllFiles();
                configFormVal('AddRecompensa', recompensaCrud.validaciones.INSERT, () => recompensaCrud.eventos.INSERT());
            });

            $('#modalEditRecompensa').on('show.bs.modal', function (e) {
                myDropzoneEdiRecompensa.removeAllFiles();
                configFormVal('EditRecompensa', recompensaCrud.validaciones.UPDATE, () => recompensaCrud.eventos.UPDATE());
                func.actualizarForm('EditRecompensa', recompensaCrud.variables.rowEdit);
                agregarArchivoADropzone(recompensaCrud.variables.rowEdit?.ruta, myDropzoneEdiRecompensa);
            });

            //   // * FORMULARIOS
            $(`#${recompensaTable}`).on('click', '.edit-row-button', function () {
                const data = CrecompensaTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró la recompensa seleccionado');
                recompensaCrud.variables.rowEdit = data;
                $('#modalEditRecompensa').modal('show');
            });

            $(`#${recompensaTable}`).on('click', '.delete-row-button', function () {
                const data = CrecompensaTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró la recompensa seleccionado');
                swalFire.confirmar('¿Está seguro de eliminar la recompensa?', {
                    1: () => recompensaCrud.eventos.DELETE(data.id)
                });
            });
        },
        variables: {
            rowEdit: {}
        },
        eventos: {
            TABLE: () => {
                if (!CrecompensaTable) {
                    CrecompensaTable = $(`#${recompensaTable}`).DataTable({
                        ...configTable(),
                        ajax: {
                            url: uisApis.API + '=Buscar',
                            type: 'GET',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || null));
                            },
                            data: function (d) {
                                delete d.columns;
                                d.ESTADO = func.obtenerCESTDO(recompensaTable);
                            }
                        },
                        columns: [
                            { data: 'rn', title: '' },
                            { data: null, title: 'Nombres', render: data => `
                                <div class="d-flex align-items-center gap-3">
                                    <div class="avatar avatar-sm">
                                        <img src="${data.ruta}" alt="avatar" class="avatar-img rounded-circle">
                                        </div>
                                        <div class="d-flex flex-column">
                                            <small class="mb-0">${data.nombre}</small>
                                        </div>
                                    </div>` },
                            { data: 'codigo', title: 'Código' },  
                            { data: 'puntos', title: 'Puntos', className: 'text-center' },
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
                                    </div>`;
                                }
                            }
                        ],
                        initComplete: function (settings, json) {
                            if ($(`#${recompensaTable}`).find('.radio-buttons').length == 0) {
                                $(`#${recompensaTable}_filter`).append(select_estados);

                                $(`#${recompensaTable}_filter .radio-buttons #radioGroup_estado`).on('change', function () {
                                    $(`#${recompensaTable}`).DataTable().ajax.reload();
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
                                    $('#modalAddRecompensa').modal('show');
                                }
                            });

                            return buttons;
                        })()
                    });
                } else {
                    CrecompensaTable.ajax.reload();
                }
            },
            INSERT: () => {

                let file = myDropzoneAddRecompensa.files[0];
                if (!file) return swalFire.error('Debe seleccionar una imagen');

                let formData = new FormData();
                formData.append('NOMBRE', $('#AddRecompensa #NOMBRE').val());
                formData.append('DESCRIPCION', $('#AddRecompensa #DESCRIPCION').val());
                formData.append('PUNTOS', $('#AddRecompensa #PUNTOS').val());
                formData.append('FILE', file);
                formData.append('ESTADO', $('#AddRecompensa #ESTADO').val());

                swalFire.cargando(['Espere un momento', 'Estamos registrando la recompensa']);
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
                            swalFire.success('recompensa registrado correctamente', '', {
                                1: () => {
                                    $('#modalAddRecompensa').modal('hide');
                                    CrecompensaTable.ajax.reload();
                                }
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al agregar el recompensa')
                });
            },
            UPDATE: () => {

                let file = myDropzoneEdiRecompensa.files[0];
                if (!file) return swalFire.error('Debe seleccionar una imagen');

                let formData = new FormData();
                formData.append('ID', recompensaCrud.variables.rowEdit.id);
                formData.append('NOMBRE', $('#EditRecompensa #NOMBRE').val());
                formData.append('DESCRIPCION', $('#EditRecompensa #DESCRIPCION').val());
                formData.append('PUNTOS', $('#EditRecompensa #PUNTOS').val());
                formData.append('FILE', file?.isExist ? null : file);
                formData.append('RUTA', recompensaCrud.variables.rowEdit.ruta);
                formData.append('ESTADO', $('#EditRecompensa #ESTADO').val());

                swalFire.cargando(['Espere un momento', 'Estamos actualizando la recompensa']);
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
                            swalFire.success('recompensa actualizado correctamente', '', {
                                1: () => {
                                    $('#modalEditRecompensa').modal('hide');
                                    CrecompensaTable.ajax.reload();
                                }
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al actualizar el recompensa')
                });
            },
            DELETE: id => {
                let formData = new FormData();
                formData.append('ID', id);

                swalFire.cargando(['Espere un momento', 'Estamos eliminando la recompensa']);
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
                            swalFire.success('recompensa eliminado correctamente', '', {
                                1: () => $(`#${recompensaTable}`).DataTable().ajax.reload()
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => swalFire.error('Ocurrió un error al eliminar el recompensa')
                });
            }
        },
        formularios: {},
        validaciones: {
            INSERT: {
                NOMBRE: agregarValidaciones({
                    required: true,
                }),
                DESCRIPCION: agregarValidaciones({
                    required: true
                }),
            },
            UPDATE: {
                NOMBRE: agregarValidaciones({
                    required: true,
                }),
                DESCRIPCION: agregarValidaciones({
                    required: true
                }),
            }
        }
    };

    const globales = {
        init: () => {
            globales.eventos.selects();
        },
        eventos: {
            selects: () => {
                let selects = []

                if (selects.length == 0) return;

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
                        error: error => swalFire.error('Ocurrió un error al cargar los datos')
                    });
                });
            }
        }
    }
    return {
        init: async () => {
            await globales.init();
            await func.limitarCaracteres();

            recompensaCrud.init();
            recompensaCrud.globales();

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
