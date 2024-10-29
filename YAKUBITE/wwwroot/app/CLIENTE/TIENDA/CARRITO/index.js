/**
 * PERSONAL CRUD JS
 */

'use strict';

const executeView = () => {
    const uisApis = {
        API: '/Cliente/Tienda/Index?handler',
        GD: '/Auth/Login/Index?handler'
    };

    // * VARIABLES


    // * TABLAS
    const carritoCrud = {
        init: () => {
            carritoCrud.eventos.initTable();
        },
        globales: () => {
            $("#carrito-refresh").on("click", () => {
                carritoCrud.eventos.initTable();
            });

            $("#carrito-eliminar").on("click", () => {
                swalFire.delete("¿Está seguro de eliminar todos los productos del carrito?", {
                    1: () => {
                        localStorage.removeItem('carrito');
                        carritoCrud.eventos.initTable();
                    }
                });
            });

            $("#btnPagarCarrito").on("click", (e) => {
                e.preventDefault();
                let store = JSON.parse(localStorage.getItem('carrito') ? localStorage.getItem('carrito') : '[]');
                if (store.length === 0) {
                    return swalFire.warning("No hay productos en el carrito");
                }

                let NOMBRES = $("#carrito-form #NOMBRES");
                let APELLIDOS = $("#carrito-form #APELLIDOS");
                let billingsEmail = $("#carrito-form #billings-email");
                let billingsCardNum = $("#carrito-form #billings-card-num");
                let billingsCardDate = $("#carrito-form #billings-card-date");
                let billingsCardCvv = $("#carrito-form #billings-card-cvv");

                let isValid = true;
                isValid &= carritoCrud.eventos.validacion(NOMBRES, /^[a-zA-Z\s]{3,}$/);
                isValid &= carritoCrud.eventos.validacion(APELLIDOS, /^[a-zA-Z\s]{3,}$/);
                isValid &= carritoCrud.eventos.validacion(billingsEmail, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
                isValid &= carritoCrud.eventos.validacion(billingsCardNum, /^(?!\s*$).+/);
                isValid &= carritoCrud.eventos.validacion(billingsCardDate, /^[0-9]{2}\/[0-9]{2}$/);
                isValid &= carritoCrud.eventos.validacion(billingsCardCvv, /^[0-9]{3}$/);

                if (isValid) {
                    carritoCrud.eventos.insertarCarrito();
                }


            });

            $("#carrito-orden").text("Orden #" + carritoCrud.eventos.generarCodigo(16));
            $("#carrito-fecha").text(carritoCrud.eventos.fechaLarga());
            $("#icon-carrito-compras").addClass("d-none");
        },
        variables: {

        },
        eventos: {
            initTable: () => {
                let store = JSON.parse(localStorage.getItem('carrito') ? localStorage.getItem('carrito') : '[]');
                let table = $('#carrito-table tbody');

                table.html('');
                if (store.length > 0) {
                    store.forEach((s, i) => {
                        table.append(`
                    <tr id="carrito-${s.IDMENU}">
                        <td>${i + 1}</td>
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <img src="${s.RUTA}" alt="${s.NOMBRE}" class="img-fluid" style="max-width: 50px;">
                                <span>${s.NOMBRE}</span>
                            </div>
                        </td>
                        <td>${func.formatoSolesPEN(s.TOTAL / s.CANTIDAD)}</td>
                        <td>${s.CANTIDAD}</td>
                        <td>${func.formatoSolesPEN(s.TOTAL)}</td>
                        <td>
                            <button class="btn btn-danger btn-sm btnEliminarCarrito"
                            data-id="${s.IDMENU}"
                            >
                                <i class="bx bx-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
                    });
                }else{
                    table.append(`
                        <tr>
                            <td colspan="6" class="text-center">No hay productos en el carrito</td>
                        </tr>
                    `);
                }
                let subtotal = store.reduce((a, b) => a + b.TOTAL, 0) || 0;
                let descuento = 0;

                $("#carrito-subtotal").text(func.formatoSolesPEN(subtotal));
                $("#carrito-descuento").text(func.formatoSolesPEN(0));
                $("#carrito-total").text(func.formatoSolesPEN(subtotal - descuento));

                $("#btnPagarCarrito").text("Pagar " + func.formatoSolesPEN(subtotal - descuento));

                $(".btnEliminarCarrito").off();
                $(".btnEliminarCarrito").on("click", async function () {
                    swalFire.delete("¿Está seguro de eliminar este producto del carrito?", {
                        1: () => {
                            let id = $(this).data('id');
                            let index = store.findIndex(s => s.IDMENU === id);
                            store.splice(index, 1);
                            localStorage.setItem('carrito', JSON.stringify(store));
                            carritoCrud.eventos.initTable();
                        }
                    });
                });

            },
            generarCodigo: (length) => {
                let result = '';
                let characters = '1234567890';
                let charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            fechaLarga: () => {
                let fecha = new Date();
                let dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
                let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                let dia = dias[fecha.getDay()];
                let mes = meses[fecha.getMonth()];
                return `${dia}, ${fecha.getDate()} de ${mes} de ${fecha.getFullYear()}`;
            },
            validacion: (ref, regex) => {
                if (!regex.test(ref.val())) {
                    ref.addClass('is-invalid');
                    return false;

                } else {
                    ref.removeClass('is-invalid');
                    return true;
                }
            },
            insertarCarrito: () => {
                let store = JSON.parse(localStorage.getItem('carrito') ? localStorage.getItem('carrito') : '[]');
                if (store.length === 0) {
                    return swalFire.warning("No hay productos en el carrito");
                }

                let subtotal = store.reduce((a, b) => a + b.TOTAL, 0) || 0;
                let descuento = 0;

                let formData = new FormData();
                formData.append('IDCLIENTE', "");
                formData.append('SUBTOTAL', subtotal);
                formData.append('DESCUENTO', descuento);
                formData.append('TOTAL', subtotal - descuento);
                formData.append('JSONCARRITO',  JSON.stringify(
                    store.map(s => {
                        return {
                            IDPROD: s.IDMENU,
                            PRECIO: s.TOTAL / s.CANTIDAD,
                            CANTIDAD: s.CANTIDAD
                        }
                    })   
                ));


                swalFire.cargando(['Espere un momento', 'Estamos procesando su solicitud']);
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
                            swalFire.success('Compra registrada correctamente', '', {
                                1: () => {
                                    localStorage.removeItem('carrito');
                                    $("#carrito-form")[0].reset();
                                    carritoCrud.eventos.initTable();
                                }
                            });
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        swalFire.error('Ocurrió un error en el servidor');
                    }
                });
            }
        },
        formularios: {},
        validaciones: {}
    };

    const globales = {
        init: () => {
            const billingZipCode = document.querySelector('.billings-zip-code'),
                creditCardMask = document.querySelector('.billing-card-mask'),
                expiryDateMask = document.querySelector('.billing-expiry-date-mask'),
                cvvMask = document.querySelector('.billing-cvv-mask');

            if (billingZipCode) {
                new Cleave(billingZipCode, {
                    delimiter: '',
                    numeral: true
                });
            }

            if (creditCardMask) {
                new Cleave(creditCardMask, {
                    creditCard: true,
                    onCreditCardTypeChanged: function (type) {
                        if (type != '' && type != 'unknown') {
                            document.querySelector('.card-type').innerHTML =
                                '<img src="' + assetsPath + 'img/icons/payments/' + type + '-cc.png" height="28"/>';
                        } else {
                            document.querySelector('.card-type').innerHTML = '';
                        }
                    }
                });
            }

            if (expiryDateMask) {
                new Cleave(expiryDateMask, {
                    date: true,
                    delimiter: '/',
                    datePattern: ['m', 'y']
                });
            }

            if (cvvMask) {
                new Cleave(cvvMask, {
                    numeral: true,
                    numeralPositiveOnly: true
                });
            }
        },
    }

    return {
        init: async () => {
            await func.limitarCaracteres();
            carritoCrud.init();
            carritoCrud.globales();
            globales.init();

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
