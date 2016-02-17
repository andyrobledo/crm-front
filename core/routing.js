
$(document).ready(function () {

    $("#views").states([
        {
            state: "/",
            templateUrl: "views/home.html"
        },
        {
            state: "contactos",
            templateUrl: "views/contactos/contactos.html",
            controller : crm.controller.contactos
        },
        {
            state: "ordenes",
            templateUrl: "views/ordenes/Ordenes.html",
            controller : crm.controller.ordenes
        }
        //{
        //    state: "altaContacto",
        //    templateUrl: "views/contactos/altaContacto.html",
        //    controller : crm.controller.altaContacto
        //}
    ], {root:'/'});


});

