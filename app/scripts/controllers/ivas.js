'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('IvasCtrl', function ($scope, modal, api) {
    
    $scope.load = function(){
      $scope.loading = true;

      api.ivas().get().success(function(res){
        $scope.records = res || [];
        $scope.loading = false;
      });
    };

    $scope.agregar = function(){
        if($scope.formIva.$invalid){
             modal.incompleteForm();
            return;
        }

        api.ivas().post($scope.form).success(function(res){
            if(res){
                $scope.records.push(res);
                delete $scope.form.data;
            }
        });
    }

    $scope.borrar = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.ivas(_record._id).delete().success(function(res){
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

            api.ivas($scope.formEdit._id).put($scope.formEdit).success(function(res){
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
