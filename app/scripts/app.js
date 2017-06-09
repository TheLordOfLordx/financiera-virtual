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
    'angularUtils.directives.dirPagination',
    'ngImgCrop',
    'angular-preload-image',
    'jkuri.datepicker',
    'vcRecaptcha',
    'ui.map',
    'facebook'
  ])
  .config(function ($stateProvider, $httpProvider, constants, $urlRouterProvider, FacebookProvider) {
        FacebookProvider.init('448351572192242');
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
              templateUrl: 'views/home/home.html',
              data: {
                pageTitle: 'Home'
              }
          })
          .state('about', {
              url: '/acercade',
              templateUrl: 'views/aboutus/aboutus.html',
              data: {
                pageTitle: 'Acerca de'
              }
          })
          .state('faq', {
              url: '/preguntas frecuentes',
              templateUrl: 'views/faq/faq.html',
              data: {
                pageTitle: 'FAQ'
              }
          })
          .state('login', {
              url: '/login',
              templateUrl: 'views/login/login.html',
              data: {
                pageTitle: 'Entrar'
              } 
          })
          .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup/signup.html',
                controller:'signupCtrl',
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
          });
  }).run(["$rootScope", "constants", "storage", "$state","sounds", "api", "$window", function($rootScope, constants, storage, $state, sounds, api, $window){
        $rootScope.currency = constants.currency;
        $rootScope.base = constants.uploadFilesUrl;
        $rootScope.isLogged = storage.get('user');
        $rootScope.user = storage.get('user');
        $rootScope.state = $state;
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
