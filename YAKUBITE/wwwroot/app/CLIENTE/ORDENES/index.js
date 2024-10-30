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

    let NameDetalleOrdenTable = "DetalleOrdenTable";
    let CTableDetalleOrdenTable;

    // * TABLAS
    const ordenesCrud = {
        init: () => {
            ordenesCrud.eventos.TABLE();
        },
        globales: () => {
            $(`#${ordenesTable}`).on('click', '.view-row-button', function () {
                const data = CordenesTable.row($(this).parents('tr')).data();
                if (!data.id) return swalFire.error('No se encontró el registro');
                ordenesCrud.variables.rowData = data.carrito.map((item, i) => ({ ...item, rn: i + 1 }));
                $('#modalAddDetalleOrden').modal('show');
                ordenesCrud.eventos.TABLEDETALLE();
            });
        },
        variables: {
            rowData: {},
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
                            },
                            dataSrc: (data) => {
                                data.data.forEach((item, i) => {
                                    item.rn = i + 1;
                                    item.jsoncarrito = JSON.parse(item.jsoncarrito);
                                });
                                return data.data;
                            }
                        },
                        columns: [
                            { data: 'rn', title: '' },
                            { data: null, title: 'Orden', render: (data) => `Orden ${data.id}` },
                            { data: 'cliente', title: 'Cliente' },
                            {
                                data: null,
                                title: 'Fecha Compra',
                                render: (data) => func.formatFecha(data.fcreacion, 'DD/MM/YYYY HH:mm A')
                            },
                            {
                                data: null,
                                title: 'Total',
                                render: (data) => {
                                    return func.formatMonto(data.total);
                                }
                            },
                            {
                                data: null,
                                title: 'Detalle',
                                render: data => {
                                    return `<div class="d-flex justify-content-center m-0 p-0">
                                          <button name="VER" class="btn btn-sm btn-icon view-row-button" title="Ver"><i class="bx bx-show"></i></button>
                                       </div>`;
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

                            return buttons;
                        })()
                    });
                } else {
                    CordenesTable.ajax.reload();
                }
            },
            TABLEDETALLE: () => {

                if (!CTableDetalleOrdenTable) {
                    CTableDetalleOrdenTable = $(`#${NameDetalleOrdenTable}`).DataTable({
                        ...configTable(null, null, [[10, 15, 20, -1], [10, 15, 20, "Todos"]], true),
                        serverSide: false,
                        data: ordenesCrud.variables.rowData,
                        columns: [
                            { data: "rn", title: '', width: "5%" },
                            { 
                                data: null, title: 'Producto',
                                render: (data) => {
                                    return `<div class="d-flex gap-2 align-items-center">
                                        <img src="${data.ruta}" alt="${data.nombre}" class="img-fluid"
                                            style="width: 50px; height: 50px; object-fit: cover;">
                                        <span>${data.nombre}</span>
                                    </div>`;
                                }
                            },
                            {
                                data: null, title: 'Precio',
                                render: (data) => {
                                    return func.formatMonto(data.precio);
                                }
                            },
                            { data: "cantidad", title: 'Cantidad', width: "10%" },
                            {
                                data: null, title: 'Total', width: "20%", className: "text-center",
                                render: (data) => {
                                    return func.formatMonto(data.precio * data.cantidad);
                                }
                            },
                        ],
                        columnDefs: [],
                        buttons:
                            (() => {
                                let buttons = []
                                return buttons;
                            })()
                    });
                } else {
                    CTableDetalleOrdenTable.clear().rows.add(ordenesCrud.variables.rowData).draw();
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
