'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategoriaCtrl
 * @description
 * # CategoriaCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CategoriaCtrl', function ($scope, $rootScope, modal, api, sweetAlert) {
    $scope.Records = false; 
    
    $scope.load = function(){
      api.categoria().get().success(function(res){
        $scope.records = res;
        $scope.Records = true;
      });
    };

    $scope.addIcon = function(){
       window.modal = modal.show({templateUrl : 'views/categorias/agregar-icono.html', size :'md', scope: $scope}, function($scope){

        });
    }

    $scope.setIcon = function(){
      console.log(this);
    }

    $scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/categorias/agregar-categoria.html', size :'md', scope: $scope, backdrop:true}, function($scope){
            if($scope.formCategoria.$invalid){
                 modal.incompleteForm();
                return;
            }

            if($rootScope.selectedNode){
              $scope.form.parent = $rootScope.selectedNode.node.id;
            }

            api.categoria().post($scope.form).success(function(res){
                if(res){
                    $scope.records.push(res);
                    sweetAlert.swal("Registro completado.", "has registrado una nueva categoria.", "success");
                    $scope.$close();
                    delete $scope.form.data;
                    delete $rootScope.selectedNode;
                }
            });
        });
    }

    $scope.delete = function(){
        var _record = angular.copy($scope.records.filter(function(obj){
          return obj.id == $rootScope.selectedNode.node.id;
        })[0]);

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.categoria(_record._id).delete().success(function(res){
                        if(res){
                             delete $rootScope.selectedNode;
                             $scope.load();
                        }
                    });
               }
           })
   }

    $scope.edit = function(){
      $scope.formEdit = angular.copy($scope.records.filter(function(obj){
        return obj.id == $rootScope.selectedNode.node.id;
      })[0]);

      window.modal = modal.show({templateUrl : 'views/categorias/editar_categoria.html', size :'md', scope: $scope, backdrop:true}, function($scope){
            if($scope.formEditCategoria.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.categoria($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                    delete $rootScope.selectedNode;
                }
            });
      });
    }

  });
