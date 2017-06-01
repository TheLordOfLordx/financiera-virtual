'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # GroceryCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ExistenciasCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
    $scope.totalVentas = 0;
    $scope.totalBases = 0;
    $scope.getStockDetail = function(){
         $scope.totalVentas = 0;
         $scope.totalBases = 0;
        
        api.cantidades().add('stock/detail').post($scope.form).success(function(res){
          $scope.records = res;
        });
    }

    $scope.totalizeVentas = function(){
        $scope.totalVentas =  $scope.totalVentas + (this.record._product.data.precio_venta * this.record.amount);
    }

    $scope.totalizeBases = function(){
        $scope.totalBases =  $scope.totalBases + ((this.record._product.data.precio + this.record._product.data.valor_utilidad) * this.record.amount);
    }
  });
