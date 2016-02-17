crm.controller.contactos = function () {


    var listacontactos = $("#listaContactos");
    var idcontacto, idorden, nom;

//public variables para usarlas en diferentes modals
    var nombre_mod, emp_mod, ema_mod, tel_mod;


    $(document).ready(function () {
        consultarall();
        consultarxId();
        CrearNuevoContacto();
    });

    function consultarall() {
        $.get("http://localhost:3000/contactos?buscar=")
            .done(function (response) {
                //var idContacto = response.params.idContacto;
                var contactos = response.result;

                $.each(contactos, function (index, contacto) {

                    listacontactos.append("<li class='list-group-item'>" +
                        "<b class = 'idconts'> ID: </b> <span  class=' idcont'>" + contacto.idcont + "</span> " +
                        "<b class = 'idnom'> Nombre: </b> <span  class=' nombre'>" + contacto.nombre + "</span>" +
                        "<b class = 'idemp'> Empresa: </b> <span  class=' empresa'>" + contacto.empresa + "</span>" +
                        "<b class = 'idemail'> Email: </b> <span  class=' email'>" + contacto.email + "</span>" +
                        "<b class = 'idtel'> Telefono: </b> <span  class=' telefono'>" + contacto.telefono + "</span>" +

                        " </br><button class='btn btn-success Ver'>Ver Ordenes</button>" +
                        " <button class='btn btn-default Modificar'>Modificar</button>" +
                        " <button class='btn btn-primary Nueva'>Crear Nueva Orden</button>" +
                        " <button class='btn btn-danger Eliminar'>Eliminar</button>" +
                        "</li>")
                });
                var itemContacto = listacontactos.find("li");

                itemContacto.find(".Eliminar").click(function (e) {
                    e.preventDefault();
                    idcontacto = $($(this).parent()[0]).find(".idcont").text();
                    var nom = $($(this).parent()[0]).find(".nombre").text();
                    bootbox.confirm("Estas Seguro de Eliminar?", function (result) {
                        if (result === false) {

                        }
                        else {
                            eliminar(idcontacto);

                        }
                    })
                });

                itemContacto.find(".Ver").click(function (e) {
                    e.preventDefault();
                    idcontacto = $($(this).parent()[0]).find(".idcont").text();
                    nom = $($(this).parent()[0]).find(".nombre").text();
                    TraerOrdenes();
                    //Example.show("Hola");

                });

                itemContacto.find(".Modificar").click(function (e) {
                    e.preventDefault();
                    idcontacto = $($(this).parent()[0]).find(".idcont").text();
                    nombre_mod = $($(this).parent()[0]).find(".nombre").text();
                    emp_mod = $($(this).parent()[0]).find(".empresa").text();
                    ema_mod = $($(this).parent()[0]).find(".email").text();
                    tel_mod = $($(this).parent()[0]).find(".telefono").text();
                    Modificar();
                });

                itemContacto.find(".Nueva").click(function (e) {
                    e.preventDefault();
                    idcontacto = $($(this).parent()[0]).find(".idcont").text();
                    nom = $($(this).parent()[0]).find(".nombre").text();
                    CrearNuevaOrden();
                });

            }).fail(function (error) {

                console.log(error);
            });//fail
    }

    function consultarxId() {
        var btnConsultar = $("#formConsultar");
        var txtidContacto = btnConsultar.find("#idcontacto");
        var newlistacontactos = btnConsultar.find("#listaContactos");
        btnConsultar.on("submit", function (e) {
            e.preventDefault();
            $("#listaContactos").empty();
            // localhost/ordenes?
            // localhost /contactos/?name=juan/ordenes
            $.get("http://localhost:3000/contactos?buscar=" + txtidContacto.val())
                .done(function (response) {
                    var contactos = response.result;
                    $.each(contactos, function (index, contacto) {
                        newlistacontactos.append("<li class='list-group-item'>" +
                            "<b class = 'idconts'> ID: </b> <span  class=' idcont'>" + contacto.idcont + "</span> " +
                            "<b class = 'idnom'> Nombre: </b> <span  class=' nombre'>" + contacto.nombre + "</span>" +
                            "<b class = 'idemp'> Empresa: </b> <span  class=' empresa'>" + contacto.empresa + "</span>" +
                            "<b class = 'idemail'> Email: </b> <span  class=' email'>" + contacto.email + "</span>" +
                            "<b class = 'idtel'> Telefono: </b> <span  class=' telefono'>" + contacto.telefono + "</span>" +

                            " </br><button class='btn btn-success Ver'>Ver Ordenes</button>" +
                            " <button class='btn btn-default Modificar'>Modificar</button>" +
                            " <button class='btn btn-primary Nueva'>Crear Nueva Orden</button>" +
                            " <button class='btn btn-danger Eliminar'>Eliminar</button>" +
                            "</li>")
                    });
                    var itemcontacto = newlistacontactos.find("li");

                    itemcontacto.find(".Eliminar").click(function (e) {
                        e.preventDefault();
                        idcontacto = $($(this).parent()[0]).find(".idcont").text();
                        bootbox.confirm("Estas Seguro de Eliminar?", function (result) {
                                if (result === false) {
                                }
                                else {
                                    eliminar(idcontacto);
                                }
                            }
                        )
                    });
                    itemcontacto.find(".Ver").click(function (e) {
                        e.preventDefault();
                        idcontacto = $($(this).parent()[0]).find(".idcont").text();
                        nom = $($(this).parent()[0]).find(".nombre").text();
                        TraerOrdenes();
                    });
                    itemcontacto.find(".Modificar").click(function (e) {
                        e.preventDefault();
                        idcontacto = $($(this).parent()[0]).find(".idcont").text();
                        nombre_mod = $($(this).parent()[0]).find(".nombre").text();
                        emp_mod = $($(this).parent()[0]).find(".empresa").text();
                        ema_mod = $($(this).parent()[0]).find(".email").text();
                        tel_mod = $($(this).parent()[0]).find(".telefono").text();
                        Modificar();
                    });
                    itemcontacto.find(".Nueva").click(function (e) {
                        e.preventDefault();
                        idcontacto = $($(this).parent()[0]).find(".idcont").text();
                        nom = $($(this).parent()[0]).find(".nombre").text();
                        CrearNuevaOrden();
                    });


                }).fail(function (error) {
                    console.log(error);
                });//fail
        });

    }

    function TraerOrdenes() {

        var mostrarOrdenesModal = bootbox.dialog({
            title: "Ordenes de: " + nom,
            message: '<form id="formOrdenes">' +
            '<ul class="list-group" id="listaOrdenes"></ul>' +
            '</form>',

            buttons: {
                main: {
                    closeButton: false,
                    label: "Cerrar!",
                    className: "btn-primary",
                    callback: function (e) {
                        mostrarOrdenesModal.modal('hide');
                    }
                },
            }

        }); // bootbox

        var listaOrdenes = mostrarOrdenesModal.find('#listaOrdenes');


        $.get("http://localhost:3000/contactos/" + idcontacto + "/ordenes")
            .done(function (response) {
                var ordenes = response.result;
                $.each(ordenes, function (index, orden) {
                    listaOrdenes.append("<li class='list-group-item'>" +
                        " <b class= 'idor'> ID Orden: </b> <span  class=' idord'>" + orden.idord + "</span> " +
                        " <b class='idcont'> | ID del Contacto: </b><span  class=' idcont'>" + orden.idcont + "</span> " +
                        " <b class= 'idobs'> | Observaciones: </b><span  class=' obs'>" + orden.obs + "</span> " +
                        " <b class= 'idfech'> | Fecha: " + "</b> <span  class=' fecha'>" + orden.fecha + "</span> " +
                        " <b class= 'iddur'> | Duracion: </b> <span  class=' duracion'>" + orden.duracion + "</span> " +
                        " </br> <button class='btn btn-danger Eliminar'>Eliminar</button>" + "</li>")
                });
                var itemOrden = listaOrdenes.find("li");
                itemOrden.find(".Eliminar").click(function (e) {
                    e.preventDefault();
                    var idorden = $($(this).parent()[0]).find(".idord").text();

                    //bootbox.alert(idorden);
                    bootbox.confirm("Estas Seguro de Eliminar?", function (result) {
                        if (result === false) {
                        }
                        else {
                            eliminarOrden(idorden);
                        }
                    });
                });
            }).fail(function (error) {
                console.log(error);
            });//fail


        mostrarOrdenesModal.modal('show');
    }

    function Modificar() {
        bootbox.dialog({
            title: "Modificar: " + idcontacto,
            message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Nombre</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="nombre" name="nombre" type="text" placeholder="' + nombre_mod + '" class="form-control input-md"> ' +
            '<span class="help-block">Escribe el Nuevo Nombre</span> </div> ' +
            '</div> ' +

            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Empresa</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="empresa" name="empresa" type="text" placeholder="' + emp_mod + '" class="form-control input-md"> ' +
            '<span class="help-block">Escribe la nueva empresa</span> </div> ' +
            '</div> ' +

            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Email</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="email" name="email" type="text" placeholder="' + ema_mod + '" class="form-control input-md"> ' +
            '<span class="help-block">Escribe el nuevo Email</span> </div> ' +
            '</div> ' +

            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Telefono</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="tel" name="tel" type="text" placeholder="' + tel_mod + '" class="form-control input-md"> ' +
            '<span class="help-block">Escribe el nuevo telefono</span> </div> ' +
            '</div> ' +
            '</div> </div>' +
            '</form> </div>  </div>',
            buttons: {
                success: {
                    label: "Actualizar",
                    className: "btn-danger",
                    type: "submit",
                    callback: function () {
                        //Nuevos Valores
                        var formActualizar = $(".form-horizontal");
                        //var idcontactoa = formActualizar.find(".idcont");
                        var name = formActualizar.find("#nombre");
                        var empresa = formActualizar.find("#empresa");
                        var email = formActualizar.find("#email");
                        var tel = formActualizar.find("#tel");

                        var nuevaorden = {
                            "nombre": name.val(),
                            "email": empresa.val(),
                            "empresa": email.val(),
                            "telefono": tel.val()
                        };

                        $.ajax({
                            url: "http://localhost:3000/contactos/" + idcontacto,
                            type: 'POST',
                            contentType: "application/json",
                            dataType: 'json',
                            data: JSON.stringify(nuevaorden),
                            success: function (data) {
                                console.log(data)

                            },
                            fail: function (error) {
                                console.log(error)
                            }
                        });


                        console.log($(this).html())
                        //bootbox.alert(idcontacto);
                        //bootbox.alert("Hello " + name.val() + " Empresa:" + empresa.val() + " Telefono: "+ tel.val()+ " Email: "+ email.val());
                        //name.show("Primary button");
                    }
                }
            }
        });
    }

    function CrearNuevaOrden() {
        bootbox.dialog({
            title: "Agregar Nueva Orden Para: " + nom,
            message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal" id="form-crear"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Observaciones</label> ' +
            '<div class="col-md-4"> ' +
            '<textarea id="obs" placeholder="Observaciones" rows="5" class="form-control input-md"></textarea> ' +
            '</div> ' +
            '</div> ' +

            '</div> </div>' +
            '</form> </div>  </div>',
            buttons: {
                success: {
                    label: "Crear",
                    lassName: "btn-primary",
                    type: "submit",
                    callback: function () {

                        var formAltaOrden = $("#form-crear");
                        var txtObs = formAltaOrden.find("#obs");
                        //var txtdur = formAltaOrden.find("#duracion")


                        var nuevoOrden = {
                            "idcont": idcontacto,
                            "obs": txtObs.val(),
                            "duracion": "0"
                        };

                        $.ajax({
                            url: 'http://localhost:3000/ordenes',
                            type: 'post',
                            contentType: "application/json",
                            dataType: 'json',
                            data: JSON.stringify(nuevoOrden),
                            success: function (data) {
                                console.log(data)
                            },
                            fail: function (error) {
                                console.log(error)
                            }
                        });

                    }

                }
            }

        })
    }

    function CrearNuevoContacto(){

        var LlamarForm = $("#Nuevo");

        LlamarForm.click("#Nuevo", function (e) {
            e.preventDefault()

            bootbox.dialog({
                title: "Crear nuevo: ",
                message: '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Nombre</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="nombre" name="nombre" type="text" placeholder="Nombre" class="form-control input-md"> ' +
                '<span class="help-block">Nombre del Contacto nuevo</span> </div> ' +
                '</div> ' +

                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Empresa</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="empresa" name="empresa" type="text" placeholder="Empresa" class="form-control input-md"> ' +
                '<span class="help-block">Escribe la nueva empresa</span> </div> ' +
                '</div> ' +

                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Email</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="email" name="email" type="text" placeholder="Email" class="form-control input-md"> ' +
                '<span class="help-block">Escribe el nuevo Email</span> </div> ' +
                '</div> ' +

                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Telefono</label> ' +
                '<div class="col-md-4"> ' +
                '<input id="tel" name="tel" type="text" placeholder="Telefono" class="form-control input-md"> ' +
                '<span class="help-block">Escribe el nuevo telefono</span> </div> ' +
                '</div> ' +
                '</div> </div>' +
                '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Crear Nuevo",
                        className: "btn-danger",
                        type: "submit",
                        callback: function () {
                            //Nuevos Valores
                            var formNuevo = $(".form-horizontal");
                            //var idcontactoa = formActualizar.find(".idcont");
                            var name = formNuevo.find("#nombre");
                            var empresa = formNuevo.find("#empresa");
                            var email = formNuevo.find("#email");
                            var tel = formNuevo.find("#tel");

                            var nuevocontacto = {
                                "nombre": name.val(),
                                "email": empresa.val(),
                                "empresa": email.val(),
                                "telefono": tel.val()
                            };

                            $.ajax({
                                url: "http://localhost:3000/contactos",
                                type: 'POST',
                                contentType: "application/json",
                                dataType: 'json',
                                data: JSON.stringify(nuevocontacto),
                                success: function (data) {
                                    console.log(data)

                                },
                                fail: function (error) {
                                    console.log(error)
                                }
                            });

                            bootbox.alert("Creado Correctamente")
                            console.log($(this).html())
                            //bootbox.alert(idcontacto);
                            //bootbox.alert("Hello " + name.val() + " Empresa:" + empresa.val() + " Telefono: "+ tel.val()+ " Email: "+ email.val());
                            //name.show("Primary button");
                        }
                    }
                }
            });

        })

    }

    function eliminar(idcontacto) {
        $.ajax({
            url: "http://localhost:3000/contactos/" + idcontacto,
            type: 'DELETE',
            success: function (result) {
                // Do something with the result
            }
        });

    }

    function eliminarOrden(idorden) {
        $.ajax({
            url: "http://localhost:3000/ordenes/" + idorden,
            type: 'DELETE',
            success: function (result) {
                // Do something with the result
            }
        });
    }



};//contacots controller