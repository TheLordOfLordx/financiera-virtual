'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('DashboardCtrl', function ($scope, api, modal, storage, $state, $rootScope, $timeout, permission) {
    $scope.load = function(){
      api.metadata("empleados").get().success(function(res){
          $scope.empleados = res;
      });

      api.metadata("apps").get().success(function(res){
          $scope.apps = res;
      });

      api.metadata("pedidos").get().success(function(res){
          $scope.pedidos = res;
      });

      api.metadata("clientes").get().success(function(res){
          $scope.clientes = res;
      });

      api.metadata("ventas").get().success(function(res){
          $scope.ventas = res;
      }); 

      api.metadata("productos").get().success(function(res){
          $scope.productos = res;
      });

      api.metadata("vendedores").get().success(function(res){
          $scope.vendedores = res;
      });

      if(angular.fromJson(localStorage.company)){
          $rootScope.user._company = angular.fromJson(localStorage.company);
      }
  	}

    $scope.go = function($event){
      if($event.code == "F2" || $event.key == "F2"){
        $state.go('dashboard.facturacion');
      }
    }

    $scope.callForEdit = function(){
      $scope.$$childHead.edit($rootScope.grid.value);
    }

    $scope.callForDelete = function(){
      $scope.$$childHead.delete($rootScope.grid.value);
    }

    $scope.callForCreate = function (){
      $scope.$$childHead.create();
    }

    $scope.callForDetails = function (){
      $scope.$$childHead.detail();
    }

    $scope.facturar = function(){
      $scope.$$childHead.facturar();
    }

    $scope.rememberCompany = function(remenber){
        if(remenber){
          storage.save('remenberCompany', company);
          return;
        }

        storage.delete('remenberCompany');
    }

    $scope.connectCompany = function(){
          var _user = $rootScope.user;
          api.empresa($rootScope.grid.value._id).get().success(function(res){
            $timeout(function(){
              $rootScope.user._company = res;
              storage.update('user', $rootScope.user);
              toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
              $state.go('dashboard', {}, {reload: true});
            });
          });       
    } 

    $scope.cambiarEmpresa = function(){
         window.modal  = modal.show({templateUrl : 'views/company/conectar.html', size :'sm', scope: $scope, backdrop:'static', windowClass: 'center-modal'}, function($scope){
            var _user = $rootScope.user;
            $scope.loading = true;
            api.empresa($scope.company._id).get().success(function(res){
              $timeout(function(){
                $rootScope.user._company = res;
                storage.update('user', $rootScope.user);
                
                if($scope.form && $scope.form.data.remenber){
                  storage.save('company', res);
                }
                //$scope.$parent.remenberCompany('company', res);
                toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                $scope.loading = false;
                $scope.$close();
               $state.go('dashboard', {}, {reload: true});
              }, 5000);
            });     
         });        
    }

    $scope.agregarIva = function(){
        window.modal = modal.show({templateUrl : 'views/iva/agregar_ivas.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarFormasDePago = function(){
        window.modal = modal.show({templateUrl : 'views/formaDePago/agregar_formaDePago.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
       });  
    }

    $scope.agregarConsecutivo = function(){
        window.modal = modal.show({templateUrl : 'views/contador/agregar_contadores.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
       });  
    }

    $scope.agregarCasaComercial = function(){
        window.modal = modal.show({templateUrl : 'views/casaComercial/agregar-casaComercial.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
       });  
    }
  });
