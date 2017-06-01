'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:CategorydetailCtrl
 * @description
 * # CategorydetailCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CategorydetailCtrl', function ($scope, $stateParams, api) {
  	$scope.load = function(){
  		if($stateParams.categoria){
  			api.categoria($stateParams.categoria).get().success(function(res){
  				$scope.record = res;
  			});
  		}
  	}
  });
