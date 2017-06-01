'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:TransportadorCtrl
 * @description
 * # TransportadorCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('TransportadorCtrl', function ($scope, api, modal) {
  	$scope.load = function(){
  		api.transportador().get().success(function(res){
  			$scope.records = res || [];
  		});
  	}

    $scope.agregar = function(){
       window.modal = modal.show({templateUrl : 'views/transportador/agregar-transportador.html', size :'md', scope: $scope}, function($scope){
            if($scope.formTransportador.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.transportador().post($scope.form).success(function(res){
                if(res){
                    $scope.load();
                    $scope.$close();
                    delete $scope.form.data;
                }
            });
        });
    }

  });
