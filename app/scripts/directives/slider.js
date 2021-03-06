'use strict';

angular.module('shoplyApp')
  .directive('slider', function ($rootScope) {
    return {
      replace:true,
      template: '<div class="slider"></div>',
      restrict: 'EA',
      scope : {
      	range : "=",
        initial :"@",
        ngModel:"=",
        step:"@"
      },

      link: function postLink(scope, element, attrs) {
        var _slider = noUiSlider.create( angular.element(element)[0], {
            start: parseInt(scope.initial),
            connect: [true,false],
            step: parseInt(scope.step),
            range: {
                min: scope.range[0],
                max: scope.range[1]
            }
        });

        console.log("slider", _slider)
        _slider.on('update', function(values, handle){
          
          scope.ngModel = values.map(function(val){
            return Math.round(val);
          })

          scope.$apply();
        });
      }
    };
  });