'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ProduccionCtrl',["$scope", "$rootScope", "modal", "api", "constants", "$state","storage",  function ($scope, $rootScope, modal, api, constants, $state, storage) {
    $scope.Records = false; 
    $scope.recordsProductos = [];

    $scope.load = function(){
      api.producciones().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
    }
    
  }]);
