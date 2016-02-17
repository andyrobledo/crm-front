/**
 * Created by gerardo on 2/2/2016.
 */

jQuery.fn.extend({
    states: function (routes, config) {

        if (!"onhashchange" in window) {
            alert("The browser does not supports the hashchange event!");
        } else {

            //cache que guarda el contexto
            var myContainer = $(this);

            //se crean objetos de forma segura, para guardar los HTML
            window.states = window.states || {};
            window.states.views = window.states.views || {};

            //bandera para saber si el estado se encontro
            var stateFinded = false;

            //cache que guarda valores de la configuracion,guarda el estado que muestra cuando no encuentra una ruta
            var stateNoFound = '';
            config['nofound'] !== undefined ? stateNoFound = config['nofound'] : null;
            //cache que guarda valores de la configuracion, guarda el estado que muestra por default
            var stateRoot = '';
            config['root'] !== undefined ? stateRoot = config['root'] : null;

            /**
             * Function privada para obtener datos de la url
             * @author: {Lucio G Pazos} gerardo@sait.mx
             * @date: 2/3/2016
             * @return: {data}  retorna un Objeto con el {url} hash completo, {token} sin querystring, {state} el estado limpio
             * **/
            var getURLdata = function () {
                var data = {};

                data.url = location.hash;
                data.token = '';
                data.hash = '';
                data.state = '';

                //TODO: Esto se puede optimizar :p
                if (data.url.length > 0) {
                    data.hash = data.url.split('?');
                    data.token = data.hash[0];
                    data.state = data.token.substr(1);
                    //validacion para permitir el estado '/'
                    //data.state.length > 1 ? data.state = data.state.split('/')[0] : null;
                }

                return data;
            };

            /**
             * Function privada para encontrar 'estados' en memoria o el objeto window.states.views
             * @author: {Lucio G Pazos} gerardo@sait.mx
             * @date: 2/2/2016
             * @params: {state} recibe como parametro el estado
             * @return: {promise}  retorna una promesa, si se encontro el estado "done" retorna el template,
             *          si No encotro el estado "fail" no retorna nada. :)
             * **/
            var findState = function (state) {
                // se crea un objeto deferred para iniciar una promesa
                var deferred = $.Deferred();

                // se obtienen los nombre de cada vista cargada en memoria
                var viewsNames = Object.keys(window.states.views);

                //se recorren las vistas en memoria
                for (var y = 0; y < viewsNames.length; y++) {
                    //si existe la vista en  memoria devuelve la promesa 'done' con el template y se sale del ciclo
                    if (state === viewsNames[y]) {
                        deferred.resolve(window.states.views[viewsNames[y]]);
                        break;
                    }//if
                }//for

                // devuelve la promesa como fail
                deferred.reject();

                //retorna el objeto con la promesa.
                return deferred.promise();
            };//function


            /**
             * Function privada para cargar en memoria los templates HTML
             * @author: {Lucio G Pazos} gerardo@sait.mx
             * @date: 2/3/2016
             * @params: {state} recibe como parametro el estado, {templateURL} URL del archivo html
             * @return: {promise}  retorna una promesa, si se encontro el estado "done" retorna el template,
             *          si No encotro el estado "fail" nretorna el error de ajax. :)
             * **/
            var loadTemplate = function (state, templateURL) {

                // se crea un objeto deferred para iniciar una promesa
                var deferred = $.Deferred();
                //bandera para saber si el template se encontro en memoria
                var templateFinded = false;
                //obtiene los nombres de las vistas en memoria
                var viewsNames = Object.keys(window.states.views);

                //se recorren las vistas en memoria
                for (var y = 0; y < viewsNames.length; y++) {
                    //si existe la vista en  memoria devuelve la promesa 'done' con el template y se sale del ciclo
                    if (state === viewsNames[y]) {
                        deferred.resolve(window.states.views[viewsNames[y]]);
                        templateFinded = true;
                        break;
                    }//if
                }//for

                //// si no se encuentra  en memoria quiere decir que aun no se carga, y lo cargamos por ajax
                if (!templateFinded) {
                    $.get(templateURL).done(function (template) {
                        window.states.views[state] = template;
                        deferred.resolve(template);
                    }).fail(function (err) {
                        // devuelve la promesa como fail
                        deferred.reject(err);
                    });
                }

                // retorna el objeto con la promesa.
                return deferred.promise();
            };//function

            /**
             * Function privada para obtener el 'querystring' de la URL
             * @author: {Lucio G Pazos} gerardo@sait.mx
             * @date: 2/2/2016
             * @params: {url} recibe como parametro la URL
             * @return: {Params}  retorna un Objeto con el query string , ejemplo {search:"juan", start"2015-15-05"}
             * **/
            //TODO: falta decodificar las url
            var getStateQueryParams = function (url) {

                var Params = {};

                if (typeof url != "undefined" || null) {

                    //Url se separa root de los parametros
                    var URL = url.split('?');

                    //se obtienen los parametros
                    try {
                        var params = URL[1].split('&');
                    } catch (e) {
                        //   console.log("La URL no tiene parametros : ", URL);
                        params = null;
                    }

                    if (params != null) {

                        //se recorren todos los parametros de la URL
                        for (var y = 0; y < params.length; y++) {

                            var param = params[y].split('=');
                            //filtro para saber si los parametros contienen 'algo'
                            if (param[1].length > 0) {
                                //si es valido se agrega al objeto de parametros
                                Params[param[0]] = param[1];

                            }//if
                        }//for
                    }

                }//if

                return Params;
            };

            /**
             * Function privada para obtener los 'params'' de la URL
             * @author: {Lucio G Pazos} gerardo@sait.mx
             * @date: 2/2/2016
             * @params: {url} recibe como parametro la URL
             * @return: {Params}  retorna un Objeto con los params , ejemplo cliente/45
             * **/
            //TODO: Hacer que acepte expresiones regulares y obtener varios params ejemplo cliente/:idcliente/orden/:idorden
            var getStateParams = function (url) {

                var Params = {};

                if (typeof url != "undefined" || null) {

                    //se obtienen los parametros
                    try {
                        Params = url.split('/')[1];
                    } catch (e) {
                        // console.log("La URL no tiene parametros : ", URL);
                        params = null;
                    }
                }

                return Params;
            };


            // function que se ejecuta cuando ocurre el metodo 'onhashchange'
            window.onhashchange = function (e) {


                var data = getURLdata();

                var url = data.url;
                var token = data.token;
                var hash = data.hash;
                var state = data.state;
                //se reinicia la bandera
                stateFinded = false;

                //se obtiene el estado 'limpio'
                console.log('Current State :  ', state);

                //se recorre el arreglo de rutas
                for (var i = 0; i < routes.length; i++) {

                    //si el estado existe
                    if (routes[i]['state'] == state) {

                        // se obtiene el url del template html, ejemplo '/src/htmls/hello.html'
                        var templateURL = routes[i]['templateUrl'];
                        var controller = routes[i]['controller'];
                        var callbacks = routes[i]['callbacks'];

                        //ejecutar cola de callbacks
                        Array.isArray(callbacks) ? callbacks.forEach(function (callback) {
                            typeof  callback === 'function' ? callback() : null;
                        }) : typeof  callbacks === 'function' ? callbacks() : null;


                        //se obtiene el nombre del archivo html, ejemplo 'hello'
                        // var filename = (templateURL.substring(templateURL.lastIndexOf('/') + 1)).split('.')[0];

                        //promesa para cargar el template en el contenedor
                        var statePromise = loadTemplate(state, templateURL).done(function (template) {
                            myContainer.html(template);
                        }).fail(function (err) {
                            console.log(err)
                        });

                        //cuando se resuelva la promesa de cargar la vista en el contenedor
                        $.when(statePromise).done(function () {
                            // se ejecuta el controlador, y se pasan como parametro el query string y los params
                            var context = {
                                'params': getStateParams(url), // Metodo para obtener los parametros, ejemplo 'cliente/78'
                                'query': getStateQueryParams(url)// Metodo para obtener el querystring de la url ejemplo 'cliente?search=juan'
                            };

                            typeof controller === 'function' ? controller.call(context, context.params, context.query) : null;
                        });

                        //se cambia la bandera que si se encontro el estado
                        stateFinded = true;
                        //se rompe el ciclo, ya que encontro el estado
                        break;
                    }//if , si encontro estado

                }//for para buscar en los estados

                //si el estado no se encontro va al estado 'nofound' asignado en el config del router :D
                !stateFinded ? location.hash = stateNoFound : null;

            };//evento onhashchange

            var currentState = getURLdata().state;

            //validacion para conservar el estado de la aplicacion o mandarla al root
            currentState !== stateNoFound && currentState !== '' ? location.hash = currentState : location.hash = stateRoot;

            // si tiene un estado default o root , se ejecuta
            // stateRoot !== '' ? location.hash = stateRoot : null;

            //se ejecuta el evento una vez cuando carga
            window.onhashchange();

        }//validacion si es HTML5
    }
});