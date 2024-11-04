const executeView = () => {
    const uisApis = {
        ORI: "/Auth/ResetPassword/Index?handler",
    }

    // * TABLAS

  
    // * FORMULARIOS
    const recoveryCrud = {
        init: () => {
            // VERIFICAR TOKEN DE URL
            let url = new URL(window.location.href);
            let token = url.searchParams.get("token");
            
            if (!token) {
                return swalFire.error("No se ha encontrado el token de recuperación de contraseña", {
                    1: () => {
                        window.location.href = "/Auth/Login";
                    }
                });
            }
            
            try {
                const tokenParts = token.split(".");
                if (tokenParts.length !== 3) {
                    return swalFire.error("El token de recuperación de contraseña no es válido", {
                        1: () => {
                            window.location.href = "/Auth/Login";
                        }
                    });
                }
            
                const payload = JSON.parse(atob(tokenParts[1]));
                recoveryCrud.variables.identity.token = token;
                recoveryCrud.variables.identity.payload = payload;
                $("#CORREO").text(payload?.unique_name || "");
            
            } catch (error) {
                return swalFire.error("El token de recuperación de contraseña no es válido", {
                    1: () => {
                        window.location.href = "/Auth/Login";
                    }
                });
            }
            
        },
        globales: () => {
            $("#restablecer-password").on("click", function (e) {
                e.preventDefault();
                recoveryCrud.eventos.agregar();
            });
        },
        eventos: {
            agregar: () => {
                let correcto = true;
                if (!$("#formAuthentication #PASSWORD").val()) {
                    correcto = false;
                    $("#formAuthentication #PASSWORD").css("border", "1px solid red");
                } else $("#formAuthentication #PASSWORD").css("border", "1px solid #ced4da");

                if (!$("#formAuthentication #CONFIRMPASSWORD").val()) {
                    correcto = false;
                    $("#formAuthentication #CONFIRMPASSWORD").css("border", "1px solid red");
                } else $("#formAuthentication #CONFIRMPASSWORD").css("border", "1px solid #ced4da");
                
                if (!correcto) return;

                if ($("#formAuthentication #PASSWORD").val() !== $("#formAuthentication #CONFIRMPASSWORD").val()) {
                    swalFire.error("Las contraseñas no coinciden");
                } else {
                    let formData = new FormData();
                    formData.append("PASSWORD", $("#formAuthentication #PASSWORD").val());
                    formData.append("ID", recoveryCrud.variables.identity.payload?.nameid);

                    swalFire.cargando(["Espere un momento", "Estamos restableciendo su contraseña"]);
                    $.ajax({
                        url: uisApis.ORI + '=Recovery',
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
                                swalFire.success("Contraseña restablecida correctamente", "", {
                                    1: () => {
                                        $("#formAuthentication")[0].reset();
                                        window.location.href = "/Auth/Login";
                                    }
                                });
                            }

                            if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                        },
                        error: function (xhr, status, error) {
                            swalFire.error("Ocurrió un error al querer restablecer su contraseña");
                        }
                    });
                }


                // let formData = new FormData();
                // formData.append("NOMBRES", "");
                // formData.append("APELLIDOS", "");
                // formData.append("USUARIO", $("#RegisterUser #USUARIO").val());
                // formData.append("CORREO", $("#RegisterUser #CORREO").val());
                // formData.append("ROL", "2");
                // formData.append("TELEFONO", $("#RegisterUser #TELEFONO").val());
                // formData.append("PASSWORD", $("#RegisterUser #PASSWORD").val());
                
                // swalFire.cargando(["Espere un momento", "Estamos registrando su usuario"]);
                // $.ajax({
                //     url: uisApis.ORI + '=Register',
                //     beforeSend: function (xhr) {
                //         xhr.setRequestHeader("XSRF-TOKEN", "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                //     },
                //     type: 'POST',
                //     dataType: 'json',
                //     contentType: false,
                //     processData: false,
                //     data: formData,
                //     success: function (data) {
                //         if (data?.codEstado > 0) {
                //             swalFire.success("Usuario registrado correctamente", "", {
                //                 1: () => {
                //                     $("#RegisterUser")[0].reset();
                //                     window.location.href = "/Auth/Login";
                //                 }
                //             });
                //         }

                //         if (data?.codEstado <= 0) swalFire.error(data.mensaje);
                //     },
                //     error: function (xhr, status, error) {
                //         swalFire.error("Ocurrió un error al querer registrar su usuario");
                //     }
                // });
            },
        },
        validaciones: {
            recovery: {
                "PASSWORD": agregarValidaciones({
                    required: true,
                    minlength: 8,
                }),
                "CONFIRMPASSWORD": agregarValidaciones({
                    required: true,
                    minlength: 8,
                }),
            },
        },
        variables: {
            identity: {
                token: null,
                payload: null,
            }
        },
    }

    return {
        init: async (params = null) => {
            recoveryCrud.init();
            recoveryCrud.globales();
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
