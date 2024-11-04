const executeView = () => {
    const uisApis = {
        ORI: "/Auth/Login/Index?handler",
    }

    // * TABLAS

  
    // * FORMULARIOS
    const loginCrud = {
        init: () => {

        },
        globales: () => {
            configFormVal("formAuthentication", loginCrud.validaciones.autenticar, () => loginCrud.eventos.agregar());
            
            $("#btnRecovery").on("click", (e) => {
                e.preventDefault();
                $("#modalAddRecovery").modal("show");
            });

            $("#modalAddRecovery").on("shown.bs.modal", function () {
                configFormVal("AddRecovery", loginCrud.validaciones.recovery, () => loginCrud.eventos.recovery());

            });
        
        },
        eventos: {
            agregar: () => {
                let formData = new FormData();
                formData.append("USUARIO", $("#formAuthentication #USUARIO").val());
                formData.append("PASSWORD", $("#formAuthentication #PASSWORD").val());
                
                swalFire.cargando(["Espere un momento", "Estamos validando sus credenciales"]);
                $.ajax({
                    url: uisApis.ORI + '=Login',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("XSRF-TOKEN", "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                    },
                    type: 'POST',
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (data) {
                        if (data?.codEstado > 0) {
                            let decodedToken = JSON.parse(atob(data.accessToken.split('.')[1]));
                            if(decodedToken.Rol == "1"){
                                swalFire.success("Bienvenido", "Iniciando sesión", {
                                    1: () => {
                                        localStorage.setItem("accessToken", data.accessToken);
                                        window.location.href = `/Admin/Home/`;
                                    }
                                });
                            }

                            if(decodedToken.Rol == "2"){
                                swalFire.success("Bienvenido", "Iniciando sesión", {
                                    1: () => {
                                        localStorage.setItem("accessToken", data.accessToken);
                                        window.location.href = `/Cliente/Inicio`;
                                    }
                                });
                            }
                        
                        }

                        if (data?.codEstado <= 0) swalFire.error(data.message);
                    },
                    error: function (xhr, status, error) {
                        swalFire.error("Ocurrió un error al validar sus credenciales");
                    }
                });
            },
            recovery: () => {                
                swalFire.cargando(["Espere un momento", "Estamos validando su correo"]);
                $.ajax({
                    url: uisApis.ORI + '=ObtenerUser&USUARIO=' + $("#AddRecovery #USUARIO").val(),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('XSRF-TOKEN', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                    },
                    type: 'GET',
                    success: response => {
                        if(response.success){
                            return swalFire.success("Correo enviado", "Revise su bandeja de entrada", {
                                1: () => {
                                    $("#modalAddRecovery").modal("hide");
                                }
                            });
                        }
                        return swalFire.error("Ocurrió un error al enviar el correo");
                    },
                    error: error => swalFire.error('Ocurrió un error al cargar los datos')
                });
            }
        },
        validaciones: {
            autenticar: {
                "USUARIO": agregarValidaciones({
                    required: true,
                    minlength: 5,
                }),
                "PASSWORD": agregarValidaciones({
                    required: true,
                    minlength: 8,
                }),
            },
            recovery: {
                "EMAIL": agregarValidaciones({
                    required: true,
                }),
            }
        },
        variables: {
    
        },
    }

    return {
        init: async (params = null) => {
            loginCrud.init();
            loginCrud.globales();
        }
    }
}

const initGlobal = executeView();
const preloader = document.getElementById('preloader');

if(!preloader) {
    initGlobal.init();
}else{
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'style' && preloader.style.display === 'none') {
                initGlobal.init();
            } else {
                initGlobal.init(true);
            }
        });
    });
    
    observer.observe(preloader, { attributes: true });
}
