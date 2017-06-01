'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductdetailCtrl
 * @description
 * # ProductdetailCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ProductdetailCtrl', ["$scope", "api","$stateParams", function($scope, api, $stateParams){
  	$scope.load = function(){
  		if($stateParams.producto){
  			api.producto($stateParams.producto).get().success(function(res){
  				$scope.record = res;
  			});
  		}
  	}

  	$scope.upload = function(){
  		var fd = new FormData();
  		var _file =  $scope.myFiles[0];

  		fd.append('file', _file);

  		api.upload().post(fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res){
  			console.log(res);
  		});
  	}

  }]);
