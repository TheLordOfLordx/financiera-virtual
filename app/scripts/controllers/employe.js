'use strict';

angular.module('shoplyApp')
  .controller('employeCtrl', function ($scope, $timeout, $rootScope, sweetAlert, constants, $state, modal, api, storage) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.user().get().success(function(res){
          $scope.records = res.filter(function(_o){
              return _o.type == "EMPLOYE";
          });     
          $scope.Records = true;
      });
  	}

    $scope.doTonnage = function(){
      $state.go('dashboard.crear-arqueo', {employee : $rootScope.grid.selected});
    }

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/empleado/agregar_empleado.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEmploye.$invalid){
                 modal.incompleteForm();
                return;
            }
            
            $scope.form.type = "EMPLOYE";
            api.user().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has registrado un nuevo empleado.", "success");
                $scope.$close();
                $scope.load();
                delete $scope.form;
              }
            }).error(function(data, status){
              if(status == 409){
                sweetAlert.swal("Email en uso.", "este email ya se encuentra en uso.", "warning");
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._route = $scope.formEdit._route.map(function(_o){return _o._id});
      $scope.formEdit._permission = $scope.formEdit._permission ? $scope.formEdit._permission._id : null;
      $scope.formEdit._grocery = $scope.formEdit._grocery ? $scope.formEdit._grocery.map(function(g){ return g._id}) : null;
      delete $scope.formEdit.password;
      
      window.modal = modal.show({templateUrl : 'views/empleado/editar_empleado.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditEmploye.$invalid){
                 modal.incompleteForm();
                return;
            }

            if($scope.formEdit.password){
                api.verification_code().add($scope.formEdit._id).get().success(function(res){
                  if(res){
                     sweetAlert.swal({
                        title: "Escriba el codigo de verificación",
                        type: "input",
                        showCancelButton: false,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Codigo de verificación" 
                      }, function(inputValue){
                          $scope.formEdit.verificationCode = inputValue;
                          api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                              if(res){
                                  sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                                  $scope.load();
                                  $scope.$close();
                                  delete $scope.formEdit;
                              }
                          }).error(function(data, status){
                            if(status == 409){
                              sweetAlert.swal("Email en uso.", "este email ya se encuentra en uso.", "warning");
                            }
                            
                            if(status == 400){
                              sweetAlert.swal("Error de validación", "Codigo de verificación incorrecto.", "warning");
                            }
                          });
                      });                      
                  }
                });
            }else{
              api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
                  if(res){
                      sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                      $scope.load();
                      $scope.$close();
                      delete $scope.formEdit;
                  }
              });
            }
      });
    }

    $scope.delete = function(){
        var _record = this.record || $rootScope.grid.value;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.user(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });
