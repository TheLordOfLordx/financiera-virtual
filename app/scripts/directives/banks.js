'use strict';

angular.module('shoplyApp')
  .directive('banksField', function () {
  	function ctrl($scope, api, modal, $rootScope){
        $scope.records = [
          {name : 'Bancolombia.', img : 'images/bancolombia.png' },
          {name : 'Davivienda', img : 'images/davivienda.png'  },
          {name : 'Banco de Bogota', img : 'images/bogota.png'  },
          {name : 'Banco corpbanca.', img : 'images/corpobanca.png'  },
          {name : 'Banco de la republica.', img : 'images/republica.png'  },
          {name : 'Citibank.', img : 'images/citi.png'  },
          {name : 'Banco gnb.', img : 'images/gnb.png'  },
          {name : 'Banco BBVA.', img : 'images/bbva.png'  }
        ]

        $scope.myConfig = {
          noResultText :'aun no tenemos registrado este banco.',
          create:false,
          valueField: $scope.key,
          labelField: $scope.label,
          placeholder: $scope.placeholder || 'Bancos',
          maxItems: 1,
          searchField : $scope.searchby || 'name',
          maxOptions : 5,
          openOnFocus : true,
          selectOnTab : true,
          setFocus : $scope.setFocus || false,
          render: {
                option: function(item, escape) {
                    if(item.img){
                      return '<div><img class="bank-dropdown-items" src="'+item.img+'" />' +
                           '<span class="bank-dropdown-value">'+escape(item.name)+'</span></div>'
                    }
              }
          },

          onItemAdd : function(value, $item){
            /*angular.forEach($scope.records, function(v, k){
              if(v._id == value){
                $scope.setObject = $scope.records[k];
                return;
              }
            });*/

          }
        };

  	 };
      
    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        setObject:"=",
        setFocus : "=",
        key : "@",
        label : "@",
        searchby:"=",
        placeholder:"@"
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
      
      }
    };
  });