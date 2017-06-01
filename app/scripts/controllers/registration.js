'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('RegistrationCtrl', function ($scope, account, $state, sweetAlert, modal, storage) {
  	
  	$scope.register = function(){
      var _success = function(data){
        if(data){
           sweetAlert.swal("Registro completado.", "Te has registrado correctamente.", "success");
           delete $scope.formRegister;
           $state.go('login');
        }
      };

      var _error = function(data){
        if(data == 409){
            sweetAlert.swal("No se pudo registrar.", "Este email ya esta registrado.", "error");
        }
      };

      if($scope.signup.$valid){
        if($scope.formRegister.data.password != $scope.formRegister.data.confirm){
            sweetAlert.swal("Formulario Incompleto.", "las contraseñas no coinciden.", "error");
            return;
        }
          account.usuario().register(angular.extend($scope.formRegister.data, {username : $scope.formRegister.data.email})).then(_success, _error);
      }else if($scope.signup.$invalid){
            modal.incompleteForm();
      }
  	};



    $scope.login = function(){
      var _success = function(data){
        console.log(data);
      };

      var _error = function(status){
      
      };

      account.login($scope.form.data).then(_success, _error);
    };

  });
