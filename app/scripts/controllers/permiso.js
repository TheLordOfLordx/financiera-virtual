'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('PermisoCtrl', function ($scope, $window, $rootScope, $timeout, sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

  $scope.menus = $window.permisos.menus;
  $scope.forms = $window.permisos.forms;

  $scope.$watch('form.data._menu', function(n, o){
    $scope.formsCollection = angular.copy($scope.forms.filter(function(obj){
      return obj.parent == n;
    }));
  });

  $scope.$watch('formEdit.data._menu', function(n, o){
    $scope.formsCollectionEdit = angular.copy($scope.forms.filter(function(obj){
      return obj.parent == n;
    }));
  }); 


    $scope.load = function(){
      
      if($scope.permission){
        delete $scope.permission;
      }

      api.permiso().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });    
  	}

    $scope.addMenu = function(){
      if(!$scope.permission){
        $scope.permission = []; 
        $scope.form.data.menuText = $scope.getObj("menus", $scope.form.data._menu).nombre;
        $scope.form.data.menuIcon = $scope.getObj("menus", $scope.form.data._menu).icon;
        $scope.form.data.formText = $scope.getObj("forms", $scope.form.data._form) ? $scope.getObj("forms", $scope.form.data._form).nombre : null;
        $scope.permission.push(angular.copy( $scope.form.data));
        $scope.form.data._form = null;
        $scope.form.data.access = null;
      }else{
        $scope.form.data.menuText = $scope.getObj('menus', $scope.form.data._menu).nombre;
        $scope.form.data.menuIcon = $scope.getObj("menus", $scope.form.data._menu).icon;
        $scope.form.data.formText = $scope.getObj("forms", $scope.form.data._form) ? $scope.getObj("forms", $scope.form.data._form).nombre : null;
        $scope.permission.push(angular.copy($scope.form.data));
        $scope.form.data._form = null;
        $scope.form.data.access = null;
      }
    }

    $scope.getObj = function(collection, id){
      return $scope[collection].filter(function(obj){
        return obj.id == id; 
      })[0];
    }


    $scope.addMenuEdit = function(){
      var data = {};

      data._menu = $scope.formEdit.data._menu;
      data.access = $scope.formEdit.data.access;
      data._form = $scope.formEdit.data._form;
      data.menuText = $scope.getObj("menus", $scope.formEdit.data._menu).nombre
      data.menuIcon = $scope.getObj("menus", $scope.formEdit.data._menu).icon
      data.formText = $scope.getObj("forms", $scope.formEdit.data._form) ? $scope.getObj("forms", $scope.formEdit.data._form).nombre : null;
      $scope.formEdit.data.permission.push(data);
    }

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/permisos/agregar_permiso.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.permisoForm.$invalid){
                 modal.incompleteForm();
                return;
            }

            $scope.formData = new Object();
            $scope.formData.data = new Object();
            $scope.formData.data.permission = $scope.permission;
             
           sweetAlert.swal({
              title: "",
              type: "input",
              showCancelButton: false,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Perfil" 
            }, function(inputValue){
                $scope.formData.data.profile = inputValue;
                
                api.permiso().post($scope.formData).success(function(res){
                  if(res){
                    sweetAlert.swal("Registro completado.", "Has creado un nuevo perfil.", "success");
                    $timeout($scope.load());
                    delete $scope.permission;
                    delete $scope.formData;
                    $scope.$close();
                    window.swal.close();   
                  }
                });
            });  
        });
  	}

    $scope.verFormularios = function(){
      $scope.record = angular.copy(this.record.data.permission);
      
      window.modal = modal.show({templateUrl : 'views/permisos/verFormularios.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
      });
    }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      window.modal = modal.show({templateUrl : 'views/permisos/editar_permiso.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarPermiso.$invalid){
                 modal.incompleteForm();
                return;
            }

           sweetAlert.swal({
              title: "",
              type: "input",
              inputValue : $scope.formEdit.data.profile,
              showCancelButton: false,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Perfil" 
            }, function(inputValue){
                $scope.formEdit.data.profile = inputValue;
                delete $scope.formEdit.data._menu;
                delete $scope.formEdit.data._form;
                delete $scope.formEdit.data.access;
                api.permiso($scope.formEdit._id).put($scope.formEdit).success(function(res){
                    if(res){
                        sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                        $scope.$close();
                        delete $scope.formEdit.data;
                        $scope.load();
                    }
                });
            });  

      });
    }

    $scope.removeFromList = function(){
        var _record = this.record || $rootScope.grid.value;
        modal.removeConfirm({closeOnConfirm : true}, function(isConfirm){ 
            if(isConfirm){
              $scope.permission.splice($scope.permission.indexOf(_record), 1);
              $scope.$apply();              
            }

           })
    } 

    $scope.removeFromListEdit = function(){
        var _record = this.record || $rootScope.grid.value;
        modal.removeConfirm({closeOnConfirm : true}, function(isConfirm){ 
            if(isConfirm){
              $scope.formEdit.data.permission.splice($scope.formEdit.data.permission.indexOf(_record), 1);
              $scope.$apply();              
            }

           })
    } 

    $scope.delete = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.permiso(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });
