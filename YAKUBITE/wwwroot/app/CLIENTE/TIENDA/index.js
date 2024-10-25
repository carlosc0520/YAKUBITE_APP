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
  let containerRestaurantes = 'container-restaurantes';
  let containerRestaurantesPo = "container-restaurantes-populares";

  // * TABLAS
  const restaurantCrud = {
    init: () => {
      restaurantCrud.eventos.restaurantes();
    },
    globales: () => {
      $("#button-addon2").on("click", function () {
        var input = $("#input-search-restaurantes").val();
        if (input) {
          var data = restaurantCrud.variables.dataRestaurantes.filter(function (d) {
            return d.alias.toLowerCase().includes(input.toLowerCase());
          });
          restaurantCrud.eventos.createCards(data);
        } else {
          restaurantCrud.eventos.createCards(restaurantCrud.variables.dataRestaurantes);
        }
      });
    },
    variables: {
      rowEdit: {},
      dataRestaurantes: []
    },
    eventos: {
        restaurantes: async () => {
            await $.ajax({
                url: uisApis.API + '=BuscarAll&start=0&length=999999&ESTADO=A',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('XSRF-TOKEN', localStorage.getItem('accessToken'));
                },
                type: 'GET',
                success: function (response) {
                    if (response?.data) {
                        restaurantCrud.variables.dataRestaurantes = response?.data || [];
                        restaurantCrud.eventos.createCards(restaurantCrud.variables.dataRestaurantes);
                    }
                },
                error: error => swalFire.error('Ocurrió un error al cargar los restaurantes')
            });
        },
        createCards: (data) => {
          let container = document.getElementById(containerRestaurantes);
          if (!container) return;
          container.innerHTML = '';

          if (data.length === 0) {
              container.innerHTML = `
                <div class="col-12"draggable="false" style="">
                  <div class="card text-black" style="background-color: #ffcccc;">
                    <div class="card-body">
                      <h4 class="text-center p-0 m-0 card-title text-black"> <i class="bx bx-error-circle bx-lg"></i> No se encontraron resultados</h4>
                      <p class="text-center p-0 card-text">
                        Intente con otro término de búsqueda
                      </p>
                    </div>
                  </div>
                </div>
              `;
            return;
          }
         
          data.forEach(d => {
            container.innerHTML += `
            <div class="col-md-6 col-lg-4 col-xl-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="rounded rounded-3 text-center mb-3 pt-4">
                            <img class="img-fluid fixed-size" src="${d.ruta}" alt="Card girl image" 
                                 onerror="this.src='https://placehold.co/600x340';" 
                                 data-app-light-img="illustrations/sitting-girl-with-laptop-light.png" 
                                 data-app-dark-img="illustrations/sitting-girl-with-laptop-dark.png" />
                        </div>
                        <h4 class="mb-2 pb-1">${d.alias}</h4>
                        <p class="small">${d.direccion}</p>
                        <div class="row mb-3 g-3">
                            <div class="text-warning mb-3">
                                <i class="bx bxs-star bx-sm"></i>
                                <i class="bx bxs-star bx-sm"></i>
                                <i class="bx bxs-star bx-sm"></i>
                                <i class="bx bxs-star bx-sm"></i>
                                <i class="bx bx-star bx-sm"></i>
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <a href='/Cliente/Tienda/Menu?restaurant=${d.id}' class="btn btn-primary w-100 d-grid">Ir a</a>
                        </div>
                    </div>
                </div>
            </div>`;
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
      restaurantCrud.init();
      restaurantCrud.globales();

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
