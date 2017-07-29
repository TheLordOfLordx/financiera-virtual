'use strict';

angular.module('shoplyApp')
  .controller('profileCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope) {
    $scope.load = function(){
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