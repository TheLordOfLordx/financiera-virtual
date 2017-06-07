'use strict';

angular.module('shoplyApp')
  .directive('slider', function () {
    return {
      replace:true,
      template: '<div class="slider"></div>',
      restrict: 'EA',
      scope : {
      	range : "=",
        initial :"@",
        ngModel:"="
      },

      link: function postLink(scope, element, attrs) {
        var _slider = noUiSlider.create( angular.element(element)[0], {
            start: parseInt(scope.initial),
            connect: [true,false],
            range: {
                min: scope.range[0],
                max: scope.range[1]
            }
        });

        _slider.on('update', function(values, handle){
          scope.ngModel = values
          scope.$apply();
        });
      }
    };
  });