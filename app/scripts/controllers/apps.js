'use strict';

angular.module('shoplyApp')
  .controller('AppsCtrl', function ($scope, $stateParams, $timeout, sweetAlert,  constants, $state, modal, api, storage, $rootScope) {
    $scope.Records = false; 
  	
    $scope.load = function(){
      api.apps().get().success(function(res){
          $scope.records = res || [];   
          $scope.Records = true;
      });
  	}

    $scope.getPublic = function(){
      api.apps().add("public/" + $stateParams.app).get().success(function(res){
          $scope.records = res || [];   
          $scope.Records = true;
      }); 
    }

    $scope.edit = function(){
      $scope.formEdit = angular.copy($rootScope.grid.value);
       window.modal = modal.show({templateUrl : 'views/apps/editar_app.html', size :'md', scope: $scope, backdrop: 'static'}, function($scope){
            if($scope.appEditForm.$invalid){
               modal.incompleteForm();
               return;
            }

            $scope.loading = true;

            var fd  = new FormData();

            fd.append("data", JSON.stringify($scope.formEdit.data));
            fd.append("splash", $scope.form.splash);
            fd.append("icon", $scope.form.icono);

            api.apps().add("build").post(fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(res){
              if(res.data){
                  $scope.loading = false;
                  sweetAlert.swal("Correcto", "Aplicacion creada correctamente ", "success");
                  $scope.load();
                  $scope.$close();
              }
            });
        });
    }

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/apps/agregar_app.html', size :'md', scope: $scope, backdrop: 'static'}, function($scope){
            if($scope.appForm.$invalid){
               modal.incompleteForm();
               return;
            }

            $scope.loading = true;
            var fd  = new FormData();

            fd.append("data", JSON.stringify($scope.form.data));
            fd.append("splash", $scope.form.splash);
            fd.append("icon", $scope.form.icono);

            api.apps().add("build").post(fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(res){
              if(res.data){
                  $scope.loading = false;
                  sweetAlert.swal("Correcto", "Aplicacion creada correctamente ", "success");
                  $scope.load();
                  $scope.$close();
              }
            });
        });
  	}

    $scope.delete = function(){
        var _record = this.record || $rootScope.grid.value;
        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.apps(_record._id).delete().success(function(res){
                        $scope.records.splice($scope.records.indexOf(_record), 1);
                    });
               }
           })
    }
  });
