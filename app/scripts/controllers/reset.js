'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ChangepasswordCtrl
 * @description
 * # ChangepasswordCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ResetPasswordCtrl', function ($scope, $stateParams, api, sweetAlert, account, storage, $state) {
  	$scope.reset = function(){
        if($scope.resetForm.$valid){
          $scope.form.data.link = $stateParams.token;
        	api.reset_password().add($stateParams.token).post($scope.form.data).then(function(res){
        		if(res){
		           sweetAlert.swal("Cambio de clave!", "se ha cambiado correctamente", "success");
		           delete $scope.form;
               $state.go('login');
        		}
        	}, function(data){
        		if(data.status == 404){
                 sweetAlert.swal({
                        title: "Expiró",
                        text: "Este enlace ha caducado.",
                        type: "error"
                    })
        		}
        	})
        }
  	}
  });
