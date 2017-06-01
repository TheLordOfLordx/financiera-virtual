'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CasaComercialCtrl', function ($scope, modal, api) {
    $scope.loading = true; 
    
    $scope.load = function(){
      api.casa_comercial().get().success(function(res){
        $scope.records = res || [];
        $scope.loading = false; 
      });
    };

    $scope.agregar = function(){
        if($scope.formCasaComercial.$invalid){
             modal.incompleteForm();
            return;
        }

        api.casa_comercial().post($scope.form).success(function(res){
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
                    api.casa_comercial(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      window.modal = modal.show({templateUrl : 'views/casaComercial/editar-casaComercial.html', size :'md', scope: $scope}, function($scope){
            if($scope.$$childTail.$invalid){
                 modal.incompleteForm();
                return;
            }
      
            api.casa_comercial($scope.formEdit._id).put($scope.formEdit).success(function(res){
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
