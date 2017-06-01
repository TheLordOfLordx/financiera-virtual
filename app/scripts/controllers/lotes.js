'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('LotesCtrl', function ($scope, modal, api, $stateParams) {
    $scope.Records = false; 

    $scope.load = function(){
      if($stateParams.requests){
        $scope.requests = $stateParams.requests;
        console.log($stateParams.requests);
      }

      api.lotes().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true; 
      });
    };

    $scope.MostrarTallasCantidades = function(allowWrite){
      $scope.set = this.record;
      $scope.allowWrite = allowWrite;
      modal.show({templateUrl : 'views/ordenes/TallasCantidades.html', size :'md', scope : $scope, backdrop:'static'}, function($scope){
        $scope.$close();
      });
    }

    $scope.MostrarMateriales = function(allowWrite){
      $scope.components = this.record.component;

      modal.show({templateUrl : 'views/lotes/materiales.html', size :'lg', scope : $scope, backdrop:'static'}, function($scope){
          $scope.$close();
      });
    }

    $scope.listado = function(data){
      if(data){
          $scope.listadoProducts = data;
      }else{
          $scope.listadoProducts = angular.copy(this.record.data.request);
      }
      
      window.modal = modal.show({templateUrl : 'views/lotes/listado.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
      }); 
    }

    $scope.producir = function(){
      $scope.productionDate = new Date();
      $scope.productionRequestRecords = [];
      $scope.formProduction = {};
      $scope.formProduction.data = {}
      $scope.formProduction.data.lote = this.record;

      window.modal = modal.show({templateUrl : 'views/produccion/agregarProduccion.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
      }); 
    }

    $scope.agregar = function(){
      window.modal = modal.show({templateUrl : 'views/lotes/crear_lotes.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        if($scope.formLotes.$invalid){
             modal.incompleteForm();
            return;
        }

        $scope.form.data.request = $scope.$parent.requests; 

        api.lotes().post($scope.form).success(function(res){
            if(res){
                $scope.records.push(res);
                delete $scope.form.data;
                delete $scope.$parent.requests;
                $scope.$close();
                sweetAlert("Registro Creado", "Registro creado correctamente.", "success");
            }
        });
      });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.lotes(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      window.modal = modal.show({templateUrl : 'views/iva/editar_ivas.html', size :'md', scope: $scope}, function($scope){
            if($scope.$$childTail.formEditIva.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.lotes($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                }
            });
      });
    }

  });
