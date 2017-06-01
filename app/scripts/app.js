'use strict';

/**
 * @ngdoc overview
 * @name shoplyApp
 * @description
 * # shoplyApp
 *
 * Main module of the application.
 */
angular
  .module('shoplyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'firebase',
    'selectize',
    'ui.bootstrap',
    'jsTree.directive',
    'angularUtils.directives.dirPagination',
    'internationalPhoneNumber',
    'ngImgCrop',
    'angular-preload-image',
    'jkuri.datepicker',
    'colorpicker.module',
    'vcRecaptcha',
    'cfp.hotkeys',
    'ui.map',
    'tb-color-picker',
    'ngJsonExportExcel'
  ])
  .config(function ($stateProvider, ipnConfig,  $httpProvider, constants, $urlRouterProvider) {
        ipnConfig.defaultCountry = 'co'
        ipnConfig.preferredCountries = ['pl', 'de', 'fr', 'uk', 'es'];
        $httpProvider.interceptors.push(function($injector, $q, sweetAlert, storage) {
        var rootScope = $injector.get('$rootScope');

        return {
            'request': function(config) {
                
                $httpProvider.defaults.withCredentials = false;
                
                if(window.localStorage.token){
                   $httpProvider.defaults.headers.common['x-shoply-auth'] =  window.localStorage.token ; // common
                   $httpProvider.defaults.headers.common['x-shoply-user'] =  angular.fromJson(window.localStorage.user) ?  angular.fromJson(window.localStorage.user)._id : null  ; // common
                   
                   if(angular.fromJson(window.localStorage.user)._company){
                      $httpProvider.defaults.headers.common['x-shoply-company']  = angular.fromJson(window.localStorage.user)._company._id ||  angular.fromJson(window.localStorage.user)._company || angular.fromJson(localStorage.company)._id ||  $rootScope.user._company;
                   }else if(localStorage.company){
                      $httpProvider.defaults.headers.common['x-shoply-company']  =  angular.fromJson(localStorage.company)._id ||  $rootScope.user._company;
                   }
                }
                 
                console.log(config, 'request')
                
                if(config.method == 'POST'){
                    config.data.metadata = config.data.metadata || {}
                    config.data.metadata._author = window.localStorage.user ? angular.fromJson(window.localStorage.user)._id : null; 
                  }
                /*for (var x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }*/

                return config || $q.when(config);
            },
            'response': function(response) {
                return response;

            },
            'responseError': function(rejection) {
                 switch(rejection.status){

                    case 401:

                    storage.delete('token');
                    storage.delete('user');
                    delete rootScope.isLogged;
                    
                    if(!window.location.hash.match("login")){
                         sweetAlert.swal({
                                title: "La sesión ha expirado",
                                text: "Tiempo de sesión agotado, por favor ingrese nuevamente",
                                imageUrl:"images/expired.png"
                            }, function(){

                                 if(window.sweet)
                                    window.sweet.hide();
                                 if(window.modal)
                                    window.modal.close();

                                window.localStorage.clear();
                                window.location = "#/login";
                               
                            });
                    }
                    else
                      return $q.reject(rejection);
                      break;

                    default:
                    return $q.reject(rejection);
                    break;

                 }
                  
                }
        };
    });

      $urlRouterProvider.otherwise("/dashboard");
      $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'views/home/content.html',
              data: {
                pageTitle: 'Home'
              }
          })
          .state('about', {
              url: '/about',
              templateUrl: 'views/aboutus/aboutus.html',
              data: {
                pageTitle: 'Acerca de'
              }
          })
          .state('faq', {
              url: '/faq',
              templateUrl: 'views/faq/faq.html',
              data: {
                pageTitle: 'FAQ'
              }
          })
          .state('login', {
              url: '/login',
              templateUrl: 'views/login/login.html',
              data: {
                pageTitle: 'Ingresar'
              } 
          })
          .state('login.quickstart', {
              url: '/quickstart',
              templateUrl: 'views/register/register.html',
              controller:'RegistrationCtrl',
              data: {
                pageTitle: 'Registrarse'
              } 
          })
          .state('dashboard.empresa', {
              url: '/empresa',
              controller:'CompanyCtrl',
              access: { requiredAuthentication: true },
              templateUrl: 'views/company/empresas.html',
              data: {
                pageTitle: 'Empresa'
              }
          })
          .state('dashboard.apps', {
              url: '/apps',
              access: { requiredAuthentication: true },
              controller:'AppsCtrl',
              templateUrl: 'views/apps/apps.html',
              data: {
                pageTitle: 'Apps'
              }
          })
          .state('dashboard.permiso', {
              url: '/permiso',
              access: { requiredAuthentication: true },
              controller:'PermisoCtrl',
              templateUrl: 'views/permisos/permisos.html',
              data: {
                pageTitle: 'Permisos'
              }
          })
          .state('dashboard.bodega', {
              url: '/bodega',
              access: { requiredAuthentication: true },
              controller:'GroceryCtrl',
              templateUrl: 'views/bodega/bodegas.html',
              data: {
                pageTitle: 'Bodega'
              }
          })
          .state('dashboard.entradas', {
              url: '/entradas',
              access: { requiredAuthentication: true },
              controller:'EntradaCtrl',
              templateUrl: 'views/entradas/entradas.html',
              data: {
                pageTitle: 'Entradas'
              }
          })
          .state('dashboard.salidas', {
              url: '/salidas',
              access: { requiredAuthentication: true },
              controller:'SalidaCtrl',
              templateUrl: 'views/salidas/salidas.html',
              data: {
                pageTitle: 'Salidas'
              }
          })
          .state('dashboard.existencias', {
              url: '/existencias',
              access: { requiredAuthentication: true },
              controller:'ExistenciasCtrl',
              templateUrl: 'views/existencias/existencias.html',
              data: {
                pageTitle: 'Existencias'
              }
          })
          .state('public', {
              url: '/public/:app',
              templateUrl: 'views/apps/public/app.html',
              data: {
                pageTitle: 'Descargar Aplicación'
              }
          })
          .state('dashboard.empresa.information', {
              url: '/information',
              access: { requiredAuthentication: true },
              templateUrl: 'views/company/form-information.html',
              data: {
                pageTitle: 'Información Corporativa'
              }
          })
          // url will be /form/interests
          .state('dashboard.empresa.location', {
              url: '/location',
              access: { requiredAuthentication: true },
              templateUrl: 'views/company/form-location.html',
              data: {
                pageTitle: 'Ubicación'
              }
          })
          // url will be /form/payment
          .state('dashboard.empresa.logo', {
              url: '/logo',
              access: { requiredAuthentication: true },
              templateUrl: 'views/company/form-logo.html',
              data: {
                pageTitle: 'Imagen corporativa'
              }
          })
          .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup/signup.html',
                controller:'RegistrationCtrl',
                data: {
                  pageTitle: 'Registrarse'
                }
          })
          .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/forgot/forgot.html',
                data: {
                  pageTitle: 'Recuperar clave'
                }
          })
          .state('reset', {
                url: '/reset/:token',
                templateUrl: 'views/reset/reset.html',
                data: {
                  pageTitle: 'Cambiar clave'
                }
          })
          .state('dashboard.change-password', {
                url: '/change-password',
                access: { requiredAuthentication: true },
                templateUrl: 'views/reset/change_password.html',
                data: {
                  pageTitle: 'Cambiar clave'
                }
          })
          .state('dashboard', {
                url: '/dashboard',
                access: { requiredAuthentication: true },
                templateUrl: 'views/dashboard/dashboard.html',
                data: {
                  pageTitle: 'Administración'
                }
          })
          .state('dashboard.productos', {
                url: '/productos',
                access: { requiredAuthentication: true },
                controller : 'ProductosCtrl',
                templateUrl: 'views/productos/productos.html',
                data: {
                  pageTitle: 'Productos'
                }
          })
          .state('dashboard.production', {
                url: '/production',
                access: { requiredAuthentication: true },
                controller : 'ProduccionCtrl',
                templateUrl: 'views/produccion/producciones.html',
                data: {
                  pageTitle: 'Ordenes de Producción'
                }
          })
          .state('dashboard.facturacion', {
                url: '/facturacion',
                access: { requiredAuthentication: true },
                controller : 'FacturacionCtrl',
                templateUrl: 'views/facturacion/facturaciones.html',
                data: {
                  pageTitle: 'Facturar'
                }
          })
          .state('dashboard.facturacion-pedido', {
                url: '/facturacion-pedido/:pedido',
                access: { requiredAuthentication: true },
                controller : 'FacturacionCtrl',
                templateUrl: 'views/facturacion/facturaciones.html',
                data: {
                  pageTitle: 'Facturar Pedido'
                }
          })
          .state('dashboard.editar-facturacion', {
                url: '/editar-facturacion/:facturacion',
                access: { requiredAuthentication: true },
                controller : 'FacturacionCtrl',
                templateUrl: 'views/facturacion/facturaciones.html',
                data: {
                  pageTitle: 'Editar-Devolver'
                }
          })
          .state('dashboard.devoluciones', {
                url: '/devoluciones',
                access: { requiredAuthentication: true },
                controller : 'DevolucionesCtrl',
                templateUrl: 'views/devoluciones/devoluciones.html',
                data: {
                  pageTitle: 'Devoluciones'
                }
          })
          .state('dashboard.buscar-facturacion', {
                url: '/buscar-facturacion',
                access: { requiredAuthentication: true },
                templateUrl: 'views/facturacion/buscar-facturacion.html',
                data: {
                  pageTitle: 'Buscar Facturación'
                }
          })
          .state('dashboard.vendedores', {
                url: '/vendedores',
                access: { requiredAuthentication: true },
                controller : 'SellerCtrl',
                templateUrl: 'views/vendedores/vendedores.html',
                data: {
                  pageTitle: 'Vendedores'
                }
          })
          .state('dashboard.empleados', {
                url: '/empleados',
                controller:'employeCtrl',
                access: { requiredAuthentication: true },
                templateUrl: 'views/empleado/empleados.html',
                data: {
                  pageTitle: 'empleados'
                }
          })
          .state('dashboard.clientes', {
                url: '/clientes',
                access: { requiredAuthentication: true },
                controller:'ClientCtrl',
                templateUrl: 'views/clientes/clientes.html',
                data: {
                  pageTitle: 'Clientes'
                }
          })
          .state('dashboard.arqueos', {
                url: '/arqueos/:highlight?',
                access: { requiredAuthentication: true },
                controller : 'ArqueoCtrl',
                templateUrl: 'views/arqueos/arqueos.html',
                data: {
                  pageTitle: 'arqueos'
                }
          })
          .state('dashboard.crear-arqueo', {
                url: '/crear-arqueo/:employee?',
                access: { requiredAuthentication: true },
                controller:'ArqueoCtrl',
                templateUrl: 'views/arqueos/crear-arqueo.html',
                data: {
                  pageTitle: 'Crear Arqueo'
                }
          })
          .state('dashboard.editar-arqueo', {
                url: '/editar-arqueo/:arqueo',
                access: { requiredAuthentication: true },
                templateUrl: 'views/arqueos/editar-arqueo.html',
                data: {
                  pageTitle: 'Editar Arqueo'
                }
          })
          .state('dashboard.detalle_cliente', {
                url: '/detalle-cliente/:cliente',
                access: { requiredAuthentication: true },
                templateUrl: 'views/clientes/detalle-cliente.html',
                data: {
                  pageTitle: 'Detalle del clientes'
                }
          })
          .state('dashboard.detalle_arqueo', {
                url: '/detalle-arqueo/:arqueo',
                access: { requiredAuthentication: true },
                templateUrl: 'views/arqueos/detalle-arqueo.html',
                data: {
                  pageTitle: 'Detalle de arqueo'
                }
          })
          .state('dashboard.rutas', {
                url: '/rutas',
                access: { requiredAuthentication: true },
                controller:'RouteCtrl',
                templateUrl: 'views/rutas/rutas.html',
                data: {
                  pageTitle: 'Rutas'
                }
          })
          
          .state('dashboard.categorias', {
                url: '/categorias',
                access: { requiredAuthentication: true },
                controller:'CategoriaCtrl',
                templateUrl: 'views/categorias/categorias.html',
                data: {
                  pageTitle: 'Categorias'
                }
          })
          .state('dashboard.detalle_categoria', {
                url: '/detalle-categoria/:categoria',
                access: { requiredAuthentication: true },
                templateUrl: 'views/categorias/detalle-categoria.html',
                data: {
                  pageTitle: 'Detalle categoria'
                }
          })
          .state('dashboard.detalle_producto', {
                url: '/detalle-producto/:producto',
                access: { requiredAuthentication: true },
                templateUrl: 'views/productos/detalle_producto.html',
                data: {
                  pageTitle: 'Detalle producto'
                }
          })
          .state('dashboard.ordenes', {
                url: '/ordenes',
                access: { requiredAuthentication: true },
                controller:'RequestCtrl',
                templateUrl: 'views/ordenes/ordenes.html',
                data: {
                  pageTitle: 'Ordenes'
                }
          })
          .state('dashboard.vista-previa', {
                url: '/vista-previa',
                access: { requiredAuthentication: true },
                controller:'VistaPreviaCtrl',
                templateUrl: 'views/ordenes/vista-previa.html',
                params: { requests: null},
                data: {
                  pageTitle: 'Vista Previa'
                }
          })
          .state('dashboard.lotes', {
                url: '/lotes',
                access: { requiredAuthentication: true },
                controller:'LotesCtrl',
                templateUrl: 'views/lotes/lotes.html',
                params: { requests: null},
                data: {
                  pageTitle: 'Lotes'
                }
          })
          .state('dashboard.perfil', {
                url: '/perfil',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/profile.html',
                data: {
                  pageTitle: 'Perfil'
                }
          })
          .state('dashboard.transportador', {
                url: '/transportadores',
                access: { requiredAuthentication: true },
                templateUrl: 'views/transportador/transportador.html'
          })
          .state('dashboard.detalle_pedido', {
                url: '/detalle-pedido/:pedido',
                access: { requiredAuthentication: true },
                templateUrl: 'views/ordenes/detalle-pedido.html',
                data: {
                  pageTitle: 'Detalle pedido'
                }
          });
  }).run(["$rootScope", "constants", "storage", "$state","sounds", "api","$window","permission",  function($rootScope, constants, storage, $state, sounds, api, $window, permission){
        $rootScope.currency = constants.currency;
        $rootScope.base = constants.uploadFilesUrl;
        $rootScope.isLogged = storage.get('user');
        $rootScope.user = storage.get('user');
        $rootScope.state = $state;
        $rootScope.acl = permission;
        $rootScope.online = navigator.onLine;

        $window.addEventListener("offline", function() {
          $rootScope.$apply(function() {
            $rootScope.online = false;
          });
        }, false);

        $window.addEventListener("online", function() {
          $rootScope.$apply(function() {
            $rootScope.online = true;
          });
        }, false);


        /*window.socket = new io(constants.socket);

        window.socket.on("connect", function(){
            if($rootScope.user && $rootScope.user._company){
                window.socket.emit("_company", $rootScope.user._company._id);
            }
        });

        window.socket.on('request', function(data){
          if(window.location.hash.match("dashboard")){
              toastr.options.onclick = function(){
                $state.go('dashboard.detalle_pedido', {pedido:data._id});
              };

              toastr.success('ha llegado un nuevo pedido', {timeOut: 10000});

              sounds.onRequest();

              api.pedido(data._id).get().success(function(res){
                  $rootScope.$emit("incoming_request", res);
              });            
          }
        });*/

      $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams){
            if($rootScope.grid)
              delete $rootScope.grid;
            if(window.modal){
              window.modal.close();
            }
            
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !storage.get('token')) {
                    event.preventDefault();
                    $state.transitionTo('login');
            }
      });
  }]);
