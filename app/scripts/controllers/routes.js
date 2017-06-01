'use strict';

angular.module('shoplyApp')
  .controller('RouteCtrl', function ($scope,$rootScope, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.rutas().get().success(function(res){
        $scope.records =  res || [];

        $scope.Records = true;
      });
  	}

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/rutas/agregar-ruta.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formRuta.$invalid){
                 modal.incompleteForm();
                return;
            }
            
            api.rutas().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado un nuevo vendedor.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      
      if($scope.formEdit.data.barrios){
        $scope.barrios = $scope.formEdit.data.barrios.map(function(o){
            var _obj = new Object();
            _obj.text = o;
            _obj.value = o;

            return _obj;
        });        
      }

      window.modal = modal.show({templateUrl : 'views/rutas/editar-ruta.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.rutaEditForm.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.rutas($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit;
                }
            });
      });
    }

    $scope.delete = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.rutas(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });
