'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('FormaDePagoCtrl', function ($scope, modal, api) {
    
    $scope.load = function(){
      $scope.loading = true;

      api.formas_pagos().get().success(function(res){
        $scope.records = res || [];
        $scope.loading = false;
      });
    };

    $scope.agregar = function(){
        if($scope.formFormaPagos.$invalid){
             modal.incompleteForm();
            return;
        }

        api.formas_pagos().post($scope.form).success(function(res){
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
                    api.formas_pagos(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      window.modal = modal.show({templateUrl : 'views/formaDePago/editar_forma_pago.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.$$childTail.formEditformaPago.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.formas_pagos($scope.formEdit._id).put($scope.formEdit).success(function(res){
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
