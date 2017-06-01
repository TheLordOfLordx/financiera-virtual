'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:iconPicker
 * @description
 * # iconPicker
 */
angular.module('shoplyApp')
  .directive('iconPicker', function () {
  	function ctrl($scope, modal){
  		$scope.selected = null;

  		$scope.iconPickerForm = function(){
	       modal.show({templateUrl : 'views/categorias/agregar-icono.html', size :'md', scope: $scope}, function($scope){
            $scope.$close();
	        }); 			
  		}

  		$scope.setIcon = function($event){
  			$scope.ngModel = $event.currentTarget.classList[1];
  			$scope.selected =  $event.currentTarget.classList[1];
        $scope.$$childHead.$close();
  		}
  	}

    return {
      template: '<a href="" ng-click="iconPickerForm()" >Elejir un Icono</a>',
      restrict: 'E',
      scope : {
      	ngModel : "="
      },
      link: function postLink(scope, element, attrs) {
       
      },
      controller : ctrl
    };
  });
