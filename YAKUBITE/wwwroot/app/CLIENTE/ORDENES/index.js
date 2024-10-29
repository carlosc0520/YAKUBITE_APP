/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Cliente/Ordenes/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };

    // * VARIABLES
    let ordenesTable = 'ordenesTable';
    let CordenesTable = null;

    // * TABLAS
    const ordenesCrud = {
        init: () => {
            ordenesCrud.eventos.TABLE();
        },
        globales: () => {

        },
        variables: {
            rowEdit: {},
        },
        eventos: {
            TABLE: () => {
                if (!CordenesTable) {
                    CordenesTable = $(`#${ordenesTable}`).DataTable({
                        ...configTable(),
                        ajax: {
                            url: uisApis.API + '=Buscar',
                            type: 'GET',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || null));
                            },
                            data: function (d) {
                                delete d.columns;
                                d.ESTADO = func.obtenerCESTDO(ordenesTable);
                            }
                        },
                        columns: [
                            {
                                data: 'rn', title: '',
                                render: (data) => {
                                    console.log(data);
                                }
                            }
                        ],
                        initComplete: function (settings, json) {
                            if ($(`#${ordenesTable}`).find('.radio-buttons').length == 0) {
                                $(`#${ordenesTable}_filter`).append(select_estados);

                                $(`#${ordenesTable}_filter .radio-buttons #radioGroup_estado`).on('change', function () {
                                    $(`#${ordenesTable}`).DataTable().ajax.reload();
                                });
                            }
                        },
                        columnDefs: [],
                        buttons: (() => {
                            let buttons = [];

                            // AGREGAR al inicio PLANTILLA
                            buttons.unshift({
                                text: '<i class="bx bx-plus me-0 me-md-2"></i><span class="d-none d-md-inline-block">Agregar</span>',
                                className: 'btn btn-label-primary btn-add-new',
                                action: function (e, dt, node, config) {
                                    //   $('#modalAddMenu').modal('show');
                                }
                            });

                            return buttons;
                        })()
                    });
                } else {
                    CordenesTable.ajax.reload();
                }
            }
        },
        formularios: {},
        validaciones: {}
    };

    return {
        init: async () => {
            ordenesCrud.init();
            ordenesCrud.globales();

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
