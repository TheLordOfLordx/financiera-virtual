angular
    .module('shoplyApp')
    .controller('locationCtrl', locationCtrl)

   function locationCtrl($scope, $rootScope, sweetAlert, $state, $timeout) {
      $scope.mapOptions = {
          zoom: 14,
          icon:'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          center: new google.maps.LatLng($scope.$parent.$parent.ubicacion.latitude, $scope.$parent.$parent.ubicacion.longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          disableDefaultUI: true
  };

    $scope.load = function(){
        $scope.$watch('myMap', function(o, n){
          if(n){
            //lanzamos este evento para evitar el issue del mapa en blanco.
            google.maps.event.trigger($scope.myMap,'resize');

            $scope.myMap.setCenter(new google.maps.LatLng($scope.$parent.$parent.ubicacion.latitude, $scope.$parent.$parent.ubicacion.longitude));
            var location = new google.maps.LatLng($scope.$parent.$parent.ubicacion.latitude, $scope.$parent.$parent.ubicacion.longitude);
            
            marker = new google.maps.Marker({
                map:n,
                animation: google.maps.Animation.DROP,
                position: location
            });  
          }
        });
    }
}