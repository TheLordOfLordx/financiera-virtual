'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # GroceryCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('GroceryCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

    $scope.load = function(){
      api.bodega().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
  	}

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/bodega/agregar_bodega.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formBodega.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.bodega().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado una nueva empresa.", "success");
                $timeout($scope.load());
                $scope.$close();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._responsible = $scope.formEdit._responsible ? $scope.formEdit._responsible._id : null; 
      
      window.modal = modal.show({templateUrl : 'views/bodega/editar_bodega.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarBodega.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.bodega($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit.data;                      
                }
            });
      });
    }

    $scope.delete = function(record){
        var _record = record || this.record;
        if(_record._id == $rootScope.user._company._id){
            sweetAlert.swal("Ups!!", "No puedes eliminar una empresa en uso.", "warning");
            return
        }

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.bodega(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });
