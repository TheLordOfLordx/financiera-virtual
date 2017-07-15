'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('DashboardCtrl', function ($scope, modal,  api, storage, $state, $rootScope, $timeout) {
    $scope.current_date = new Date();
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.system_quote = 5000;

    $scope.load = function(){
      api.credits().add( "/" + storage.get('uid') || $rootScope.user._id ).get().success(function(res){
        $scope.records = res || [];
      });

      $scope.form.data.pay_day = $scope.pay_day($scope.form.data.days[0]);
    }

    $scope.new_credit = function(){
      window.modal = modal.show({templateUrl : 'views/credits/new_credit.html', size:'lg', scope: $scope, backdrop: 'static'}, function($scope){
           modal.confirm({
                   closeOnConfirm : true,
                   title: "Está Seguro?",
                   text: "Confirma que desea realizar este prestamo?",
                   confirmButtonColor: "#008086",
                   type: "success" },

                   function(isConfirm){ 

                       if (isConfirm) {
                          api.credits().post($scope.form).success(function(res){
                            if(res){
                               alert("guardado")
                            } 
                          });

                          $scope.$close();
                       }

                    })
      });
    }

    $scope.delete_credit = function(){

    }

    $scope.update_credit = function(){

    }

    $scope.pay_day = function (days){
      var today = new Date();

      return  new Date(today.getTime() + (days * 24 * 3600 * 1000));
    }

    $scope.totalize = function(){
      $scope.form.data.total_payment = ($scope.form.data.amount[0]) + ($scope.form.data.interests) + ($scope.form.data.system_quote || 0);
    }

    $scope.$watch('form.data.days', function(o, n){
        if(n){
            $scope.form.data.pay_day = $scope.pay_day(n[0]);      
        }

        if(o){
            $scope.form.data.pay_day = $scope.pay_day(o[0]);      
        }
    });

    $scope.$watch('form.data.amount', function(o, n){
        if(n){
              $scope.form.data.interests = (n[0] * (1.817 / 100));
              $scope.totalize();      
        }

        if(o){
             $scope.form.data.interests = (o[0] * (1.817 / 100));
             $scope.totalize();      
        }
    });
  });
