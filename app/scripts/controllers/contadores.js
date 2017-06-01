'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ContadoresCtrl', function ($scope, modal, api) {
    $scope.loading = true; 
    
    $scope.load = function(){
      api.contadores().get().success(function(res){
        $scope.records = res || [];
        $scope.loading = false; 
      });
    };

    $scope.agregar = function(){
        if($scope.formContador.$invalid){
             modal.incompleteForm();
            return;
        }

        var _data  = angular.extend($scope.form, { entityName : $scope._entity.text});
        
        api.contadores().post(_data).success(function(res){
            if(res){
                $scope.records.push(res);
                delete $scope.form.data;
            }
        }).error(function(error, status){
            if(status == 409){
                sweetAlert("Registro Duplicado", "una entidad no puede contener 2 contadores.", "warning");
            }
        });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.contadores(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);

      window.modal = modal.show({templateUrl : 'views/contador/editar_contadores.html', size :'md', scope: $scope}, function($scope){
            if($scope.formEditContador.$invalid){
                 modal.incompleteForm();
                return;
            }
      
            var _data  = new Object();
            
            _data._entity = $scope.formEdit.entity;
            _data.entityName = $scope._Editentity.text;
            _data.field = $scope.formEdit.field;
            _data.prefix = $scope.formEdit.prefix;
            _data.min = $scope.formEdit.seq; 

            api.contadores($scope.formEdit._id).put(_data).success(function(res){
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
