/**
 * Created by Home on 01/02/2016.
 */


 crm.controller.ordenes = function () {


     var listaordenes = $("#listaOrdenes");
     var idorden, idcontacto, nombre, fecha, duracion, observaciones;

     $(document).ready(function () {
         consultarOrdenes();
         consultarxId()

     });

     function consultarOrdenes() {

         $.get("http://localhost:3000/ordenes?buscar=")
             .done(function (response) {
                 //var idContacto = response.params.idContacto;
                 var ordenes = response.result;

                 $.each(ordenes, function (index, orden) {

                     listaordenes.append("<li class='list-group-item'> " +
                         " <b> ID Orden: </b> <span  class=' idord'>" + orden.idord + "</span> " +
                         " <b> | ID del Contacto: </b><span  class=' idcont'> " + orden.idcont + "</span> " +
                         " <b> | Observaciones: </b><span  class=' obs'>" + orden.obs + "</span> " +
                         " <b> | Fecha: " + "</b> <span  class=' fecha'>" + orden.fecha + "</span> " +
                         " <b> | Duracion: </b><span  class=' duracion'> " + orden.duracion + "</span> " +
                         " </br> <button class='btn btn-danger Eliminar'>Eliminar</button>" +
                         " <button class='btn btn-primary Ver'>Ver</button>" +
                         " <button class='btn btn-default Modificar'>Modificar</button>" +
                         "</li>")
                 });
                 var itemOrden = listaordenes.find("li");

                 itemOrden.find(".Eliminar").click(function (e) {
                     e.preventDefault();
                     idcontacto = $($(this).parent()[0]).find(".idcont").text();
                      idorden = $($(this).parent()[0]).find(".idord").text();
                     bootbox.confirm("Estas Seguro de Eliminar?", function (result) {
                         if (result === false) {
                         }
                         else {
                             eliminar(idorden);
                         }
                     })

                 });
                 itemOrden.find(".Ver").click(function (e) {
                     e.preventDefault();
                     idcontacto = $($(this).parent()[0]).find(".idcont").text();
                      idorden = $($(this).parent()[0]).find(".idord").text();
                     //bootbox.alert(idorden + ": Aqui vas a ver los detalles"
                     TraerOrdenes();

                 });
                     itemOrden.find(".Modificar").click(function (e) {
                     e.preventDefault();
                     idcontacto = $($(this).parent()[0]).find(".idcont").text();
                     idorden = $($(this).parent()[0]).find(".idord").text();
                     //observaciones = $($(this).parent()[0]).find(".obs").text();
                     fecha = $($(this).parent()[0]).find(".fecha").text();
                     duracion = $($(this).parent()[0]).find(".duracion").text();

                     //bootbox.alert(idorden + ": Aqui vas a modificar")
                     Modificar()

                 });


             }).fail(function (error) {

                 console.log(error);
             });//fail
     }

//consultar ordenes por id
     function consultarxId() {

         var btnConsultar = $("#formOrdenes")
         var newlistaordenes = btnConsultar.find("#listaOrdenes");
         var idcontactoA = btnConsultar.find("#idorden");

         btnConsultar.on("submit", function (e) {
             e.preventDefault();
             $("#listaOrdenes").empty();
             $.get("http://localhost:3000/ordenes?buscar=" + idcontactoA.val())
                 .done(function (response) {
                     var ordenes = response.result;
                     $.each(ordenes, function (index, orden) {
                         newlistaordenes.append("<li class='list-group-item'> " +
                             " <b> ID Orden: </b> <span  class=' idord'>" + orden.idord + "</span>" +
                             " <b> | ID del Contacto: </b> <span  class=' idcont'>" + orden.idcont + "</span>" +
                             " <b> | Observaciones: </b> <span  class=' obs'>" + orden.obs + "</span>" +
                             " <b> | Fecha: </b> <span  class= 'fecha'>" + orden.fecha + "</span>" +
                             " <b> | Duracion: </b> <span  class=' duracion'>" + orden.duracion + "</span>" +
                             " </br> <button class='btn btn-danger Eliminar'>Eliminar</button>" +
                             " <button class='btn btn-primary Ver'>Ver</button>" +
                             " <button class='btn btn-default Modificar'>Modificar</button>" +
                             "</li>")
                     });
                     var itemOrden = listaordenes.find("li");
                     itemOrden.find(".Eliminar").click(function (e) {
                         e.preventDefault();
                         var idorden = $($(this).parent()[0]).find(".idord").text();
                         bootbox.confirm("¿Estas Seguro de Eliminar?", function (result) {
                             if (result === false) {
                             }
                             else {
                                 eliminar(idorden);
                             }
                         })

                     });
                     itemOrden.find(".Ver").click(function (e) {
                         e.preventDefault();
                         idcontacto = $($(this).parent()[0]).find(".idcont").text();
                         idorden = $($(this).parent()[0]).find(".idord").text();
                         //bootbox.alert(idorden + ": Aqui vas a ver los detalles")
                          TraerOrdenes()

                     });
                     itemOrden.find(".Modificar").click(function (e) {
                         e.preventDefault();

                         var idorden = $($(this).parent()[0]).find(".idord").text();
                        // bootbox.alert(idorden + ": Aqui vas a modificar")
                         //Modificar()
                     });

                 }).fail(function (error) {
                     console.log(error);
                 });//fail

         });
     }

     function TraerOrdenes() {

         var mostrarOrdenesModal = bootbox.dialog({
             title: "Ordenes de: " + idcontacto,
             message: '<form id="formOrdenes">' +
             '<ul class="list-group" id="listaOrdenes"></ul>' +
             '<div class="crono_wrapper">'+
             "<h2 id='crono'>00:00:00</h2>"+
             '<input type="button" class="btn btn-default" value="Empezar" onclick="empezarDetener(this);">'+
             '</div>' +

             '</form>',

             buttons: {
                 main: {
                     closeButton: false,
                     label: "Cancelar!",
                     className: "btn-primary",
                     callback: function (e) {
                         mostrarOrdenesModal.modal('hide');
                     }
                 },
             }

         }); // bootbox

         var listaOrdenes = mostrarOrdenesModal.find('#listaOrdenes');


         $.get("http://localhost:3000/contactos/" + idcontacto + "/ordenes/"+ idorden)
             .done(function (response) {
                 var ordenes = response.result;
                 $.each(ordenes, function (index, orden) {
                     listaOrdenes.append("<li class='list-group-item'>" +
                         " <b class= 'idor'> ID Orden: </b> <span  class=' idord'>" + orden.idord + "</span> " +
                         " <b class='idcont'> | ID del Contacto: </b><span  class=' idcont'>" + orden.idcont + "</span> " +
                         " <b class='nombres'> | Nombre: </b><span  class=' nombre'>" + orden.nombre + "</span> " +
                         " </br><b class='obss'> Observaciones: </b><span  class=' obs'>" + orden.obs + "</span> " +
                         " </br> <button class='btn btn-danger Eliminar'>Eliminar</button>" +
                         " <button class='btn btn-info Guardar'>Cerrar Orden</button>"+
                         " </li>")
                 });
                 var itemOrden = listaOrdenes.find("li");
                 itemOrden.find(".Eliminar").click(function (e) {
                     e.preventDefault();
                     idorden = $($(this).parent()[0]).find(".idord").text();
                     bootbox.confirm("Estas Seguro de Eliminar?", function (result) {
                         if (result === false) {
                         }
                         else {
                             eliminar(idorden);
                         }
                     });
                 });

                 itemOrden.find(".Guardar").click(function(e){
                     e.preventDefault();
                     idorden = $($(this).parent()[0]).find("idord").text();
                     bootbox.alert("Guardar aqui")
                 });

             }).fail(function (error) {
                 console.log(error);
             });//fail


         mostrarOrdenesModal.modal('show');
     }

     function eliminar(idorden) {
         $.ajax({
             url: "http://localhost:3000/ordenes/" + idorden,
             type: 'DELETE',
             success: function (result) {
                 // Do something with the resul
             }
         });
     }

     function Modificar() {
         bootbox.dialog({
             title: "Modificar: " + idcontacto,
             message: '<div class="row">  ' +
             '<div class="col-md-12"> ' +
             '<form class="form-horizontal"> ' +
             '<div class="form-group"> ' +
             '<label class="col-md-4 control-label" for="name">Observaciones</label> ' +
             '<div class="col-md-4"> ' +
             '<input id="obs" name="obs" type="text" placeholder="obs" class="form-control input-md"> ' +
             '<span class="help-block">Observaciones</span> </div> ' +
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
                         observaciones = formActualizar.find("#obs");
                         var nuevaorden = {
                             "idcont": idcontacto,
                             "obs": observaciones.val(),
                             "fecha": fecha,
                             "duracion": duracion
                         };

                         $.ajax({
                             url: "http://localhost:3000/ordenes/" + idorden,
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


                         console.log(observaciones.val())
                         //bootbox.alert(idcontacto);
                         //bootbox.alert("Hello " + name.val() + " Empresa:" + empresa.val() + " Telefono: "+ tel.val()+ " Email: "+ email.val());
                         //name.show("Primary button");
                     }
                 }
             }
         });
     }

// cronometro

     var inicio=0;
     var timeout=0;

     function empezarDetener(elemento)
     {
         if(timeout==0)
         {
             // empezar el cronometro

             elemento.value="Detener";

             // Obtenemos el valor actual
             inicio=new Date().getTime();

             // iniciamos el proceso
             funcionando();
         }else{
             // detemer el cronometro

             elemento.value="Empezar";
             clearTimeout(timeout);
             timeout=0;
         }
     }

     function funcionando()
     {
         // obteneos la fecha actual
         var actual = new Date().getTime();

         // obtenemos la diferencia entre la fecha actual y la de inicio
         var diff=new Date(actual-inicio);

         // mostramos la diferencia entre la fecha actual y la inicial
         var resultado=LeadingZero(diff.getUTCHours())+":"+LeadingZero(diff.getUTCMinutes())+":"+LeadingZero(diff.getUTCSeconds());
         document.getElementById('crono_wrapper').innerHTML = resultado;

         // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
         timeout=setTimeout("funcionando()",1000);
     }

     /* Funcion que pone un 0 delante de un valor si es necesario */
     function LeadingZero(Time) {
         return (Time < 10) ? "0" + Time : + Time;
     }



 }//controller