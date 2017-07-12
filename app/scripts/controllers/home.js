'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('HomeCtrl', function ( $scope, $filter, Facebook, $timeout, storage, $rootScope ) {
  	$scope.current_date = new Date();
    $scope.form = {};
    $scope.form.data = {};

    $scope.load = function(){
      if(storage.get("rememberEmail")){
        $scope.fromStore = true;

        $scope.form.data.email = storage.get("rememberEmail");
      }
      
      $scope.form.data.pay_day = $scope.pay_day($scope.form.data.days[0]);
  	}


    $scope.$watch(function() {
      return Facebook.isReady();
    }, function(newVal) {
      $scope.facebookReady = true;
    });

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $rootScope.loggedIn = true;
          
          $scope.me(function(data){
            $rootScope.user = data;
          });
        } else {
          $rootScope.loggedIn = false;
        }
      });
    };

    $scope.me = function(callback) {
      Facebook.api('/me', { "fields" :"id, name, email, first_name, last_name, picture" }, callback);
    };

    $scope.facebook_login = function() {
      Facebook.login(function(response) {
        if(response.status == 'connected'){
          $scope.me(function(data){
           $rootScope.user  = data;
          })          
        }
      }, { scope:'email' } );
    };

  	$scope.login = function(){
  		if($scope.loginForm.$invalid){
            modal.incompleteForm();
            return;
      }

        var _success = function(res){
          if(res.user.type == "EMPLOYE" || res.user.type == "ADMINISTRATOR" || res.user.type == "OWNER"){
              var  _user =  res.user;
              var  _permission = res.user._permission;
              var  _token = res.token;

              storage.save('token', _token);
              storage.save('user', _user);

              $rootScope.isLogged = res.user;
              $rootScope.user = storage.get('user');
              $state.go(constants.login_state_sucess);          
          }else{
            sweetAlert.swal("Inhabilitado.", "Privilegios son insuficientes.", "error");
            $scope.unprivileged = true;
          }
        };

        var _error = function(res){
            $scope.failed = true;
        };

        account.usuario().ingresar($scope.form.data).then(_success, _error); 
  	}

    $scope.remember = function(remember){
      if(remember && $scope.form.data.email){
        storage.save('rememberEmail', $scope.form.data.email);
      }else{
        storage.delete('rememberEmail');
      }
    }

    $scope.pay_day = function (days){
      var today = new Date();

      return  new Date(today.getTime() + (days * 24 * 3600 * 1000));
    }

    $scope.totalize = function(){
      $scope.form.data.total_payment = ($scope.form.data.amount[0]) + ($scope.form.data.interestsDays || $scope.form.data.interests) + ($scope.form.data.system_quoteDays || $scope.form.data.system_quote || 0)+ ($scope.form.data.ivaDays || $scope.form.data.iva || 0);
    }

    $scope.$watch('form.data.days', function(o, n){
        if(n){
            $scope.form.data.pay_day = $scope.pay_day(n[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * n[0];

            $scope.form.data.system_quotePerrDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
            $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePerrDays) * (n[0]);

            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.ivaPeerdays) * (n[0]);
            
            $scope.totalize();      

        }

        if(o){
            $scope.form.data.pay_day = $scope.pay_day(o[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = $scope.form.data.interestsPeerDays * o[0];

            $scope.form.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
            $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * (o[0]);

            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.ivaPeerdays) * (o[0]);
            
            $scope.totalize();      
        }
    });

    $scope.$watch('form.data.amount', function(o, n){
        if(n){
              $scope.form.data.interests = (n[0] * (1.817 / 100));
              $scope.form.data.system_quote = (o[0] * (9.9 / 100));
              $scope.form.data.iva = ($scope.form.data.system_quote * (19 / 100));
              $scope.totalize();      
        }

        if(o){
             $scope.form.data.interests = (o[0] * (1.817 / 100));
             $scope.form.data.system_quote = (o[0] * (9.9 / 100));
             $scope.form.data.iva = ($scope.form.data.system_quote * (19 / 100));

             $scope.totalize();      
        }
    });
  });
