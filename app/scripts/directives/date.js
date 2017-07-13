  angular.module('shoplyApp').directive('dateField', function ( $timeout ) {
    function ctrl($scope, api, modal, $rootScope){

    }

    return {
      replace:true,
      template: '<input data-theme="datedrop-custom-theme" data-large-mode="true" data-toggle="datedropper" data-init-set="false" data-format="d-m-Y" type="text" data-modal="true"  id="fecha" data-lang="es" class="form-control" enableread/>',
      restrict: 'EA',
      scope : {
        ngModel : "=",
        placeholder : "@",
        required : '@'
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
        $timeout(function(){
            $(element[0]).dateDropper();
        });
      }
    };
  });