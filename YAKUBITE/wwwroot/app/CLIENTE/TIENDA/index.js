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

    },
    variables: {
      rowEdit: {}
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
                        let container = document.getElementById(containerRestaurantes);
                        container.innerHTML = '';
                        console.log(response.data);
                    }
                },
                error: error => swalFire.error('Ocurrió un error al cargar los restaurantes')
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
