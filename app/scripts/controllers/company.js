'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CompanyCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

    $scope.load = function(){
      api.empresa().add("user/" + angular.fromJson(storage.get("user"))._id).get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
  	}

    $scope.connectCompany = function(){
          var _user = $rootScope.user;
          api.empresa(this.record._id).get().success(function(res){
            $timeout(function(){
                if(res._parent){
                  $rootScope.user._company = res._parent;
                  storage.update('user', $rootScope.user);
                  toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 10000});
                  $state.go('dashboard');
                  return;
                }
                
              $rootScope.user._company = res;
              storage.update('user', $rootScope.user);
              toastr.success('Conectado con: ' + res.data.empresa , {timeOut: 1000});
            }, 1000);
          });       
    }

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/company/agregar_empresa.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEmpresa.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.empresa().post(angular.extend($scope.form, { _user : angular.fromJson(window.localStorage.user)._id})).success(function(res){
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
      $scope.formEdit._parent = $scope.formEdit._parent ? $scope.formEdit._parent._id : null; 
      window.modal = modal.show({templateUrl : 'views/company/editar_empresa.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarEmpresa.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.empresa($scope.formEdit._id).put($scope.formEdit).success(function(res){
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
                    api.empresa(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });
