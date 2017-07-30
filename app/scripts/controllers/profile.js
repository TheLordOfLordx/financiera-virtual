'use strict';

angular.module('shoplyApp')
  .controller('profileCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope, $stateParams) {
    $scope.load = function(){
        if($stateParams.token){
            api.user().add('activate/').post({ activation_token : $stateParams.token }).success(function(res){
                if(res){
                    alert("activado")
                }
            });            
        }

        $state.go('profile.basic');
    }

    $scope.go_back = function(){
        window.history.back();
    }

    $scope.update = function(){
        api.user($rootScope.user._id).put($rootScope.user).success(function(res){
            if(res){
                storage.update("user", $rootScope.user);
                delete $rootScope.beforeUpdate;
                sweetAlert("Registro Modificado", "Tu perfil ha sido actualizado", "success");
            }
        });
    }
  });