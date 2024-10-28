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
  let containerCategorias = 'categorias-menus';
  let containerMenusRestaurant = "container-menus-restaurant";

  // * TABLAS
  const menuCrud = {
    init: () => {
      menuCrud.eventos.menus();
    },
    globales: () => {
     
    },
    variables: {
      rowEdit: {},
      categorias: [],
      dataRestaurantes: []
    },
    eventos: {
        menus: async () => {
            let params = new URLSearchParams(window.location.search);
            let IDREST = params.get('restaurant');

            if (isNaN(IDREST)) {
                swalFire.error('El id del restaurante no es válido', {
                    1: () => window.location.href = '/Cliente/Tienda'
                });
                return;
            }

            swalFire.cargando(["Espere un momento", "Estamos cargando los restaurantes"]);
            await $.ajax({
                url: uisApis.API + '=BuscarMenuAll&start=0&length=999999&ESTADO=A&IDREST=' + IDREST,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                },
                type: 'GET',
                success: function (response) {
                    if(response.data && response.data.length > 0) {
                        swalFire.cerrar();
                        let categorias = [];
                        response.data.forEach(d => {
                            if(categorias.length === 0) {
                                categorias.push({id: d.categoriamenu, nombre: d.dcategoriamenu});
                            }
                            else {
                                let index = categorias.findIndex(c => c.id === d.categoriamenu);
                                if(index === -1) {
                                    categorias.push({id: d.categoriamenu, nombre: d.dcategoriamenu});
                                }
                            }
                        });

                        menuCrud.variables.categorias = categorias;
                        menuCrud.variables.dataRestaurantes = response.data;
                        menuCrud.eventos.categorias(categorias);
                        menuCrud.eventos.menusCategoria(response.data, categorias);
                    }else{
                        swalFire.error('No se encontraron menús para este restaurante', {
                            1: () => window.location.href = '/Cliente/Tienda'
                        });
                    }
                },
                error: error => swalFire.error('Ocurrió un error al cargar los restaurantes')
            });
        },
        categorias: (data) => {
            let container = document.getElementById(containerCategorias);
            if (!container) return;
            container.innerHTML = '';

            if(data.length === 0) return;

            data.forEach((d, i) => {
                container.innerHTML += `
                <li class="nav-item">
                    <a class="d-flex align-items-center text-start mx-3 ms-0 pb-3 ${i === 0 ? 'active' : ''}" data-bs-toggle="pill" href="#tab-${d.id}">
                        <i class="bx bx-food-menu fa-2x text-primary"></i>
                        <div class="ps-3">
                            <small class="text-body">Cod. ${
                                d.id.toString().padStart(2, '0')
                            }</small>
                            <h6 class="mt-n1 mb-0">${d.nombre}</h6>
                        </div>
                    </a>
                </li>
                `;
            });
        },
        menusCategoria: (data, categorias) => {
            let container = document.getElementById(containerMenusRestaurant);
            if (!container) return;
            container.innerHTML = '';

            categorias.forEach((c, i) => {
                container.innerHTML += `
                <div id="tab-${c.id}" class="tab-pane fade show p-0 ${i === 0 ? 'active' : ''}">
                    <div class="row g-4">
                        ${data.filter(d => d.categoriamenu === c.id).map(d => `
                        <div class="col-lg-6">
                            <div class="d-flex align-items-center">
                                <img class="flex-shrink-0 img-fluid 
                                cursor-pointer
                                rounded" src="${d.ruta}" alt="" style="width: 80px;">
                                <div class="w-100 d-flex flex-column text-start ps-4">
                                    <h5 class="d-flex justify-content-between border-bottom pb-2">
                                        <span>${d.nombre}</span>
                                        <span class="text-primary">S/. ${d.precio}</span>
                                    </h5>
                                    <small class="fst-italic text-muted">${d.descripcion}</small>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button title="agregar al carrito" class="btn btn-primary">
                                <i class="bx bx-cart"></i>
                                </button>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                `;
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
      menuCrud.init();
      menuCrud.globales();

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
