'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # GroceryCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('EntradaCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage) {
  	$scope.Records = false;

    $scope.load = function(){
      api.entradas().get().success(function(res){
        $scope.records = res || [];
        $scope.Records = true;
      });
  	}

  	$scope.create = function(){
       window.modal = modal.show({templateUrl : 'views/entradas/agregar_entrada.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
           if($scope.formCreateInput.$invalid){
                 modal.incompleteForm();
                return;
            }

            $scope.form.data.totalCosto = 0;
            $scope.form.data.totalprecioVenta = 0;
            $scope.form.data.cantidad = 0;

            $scope.form.data._product =  $scope.recordsNew.map(function(obj){
                delete obj.$order;
                
                $scope.form.data.totalCosto += (obj.precio * obj.cantidad);
                $scope.form.data.totalprecioVenta += obj.total;
                $scope.form.data.cantidad += obj.cantidad;

                return obj;
            });


            api.entradas().post($scope.form).success(function(res){
              if(res){
                sweetAlert.swal("Registro completado.", "has agregado una nueva entrada.", "success");
                $timeout($scope.load());
                $scope.$close();
                delete $scope.form;
              }
            });
        });
  	}

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._responsible = $scope.formEdit._responsible ? $scope.formEdit._responsible._id : null; 
      
      window.modal = modal.show({templateUrl : 'views/entradas/editar_entrada.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formEditarBodega.$invalid){
                 modal.incompleteForm();
                return;
            }

            api.entradas($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert.swal("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.formEdit.data;                      
                }
            });
      });
    }

    $scope.delete = function(record){
        var _record = record || this.record;
        if(_record._id == $rootScope.user._company._id){
            sweetAlert.swal("Ups!!", "No puedes eliminar una empresa en uso.", "warning");
            return
        }

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.entradas(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  	
  });

angular.module('shoplyApp')
  .controller('EntradaCreateCtrl', function ($scope, $timeout, $rootScope,  sweetAlert, constants, $state, modal, api, storage, shoppingCart) {
      
      $scope.tasks = [];

      $scope.load = function(){
         $scope.$parent.recordsNew = [];
      }

      $scope.addToTask = function(){
        if(this.task){
          $scope.tasks.push(this.$index);
          return
        }

        $scope.tasks.splice($scope.tasks.splice[this.$index], 1);
      }

      $scope.agregarCantidadMultiple = function(){
         window.modal = modal.show({templateUrl : 'views/facturacion/agregar-cantidad.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.cantidadModel){
              for (var i = 0; i < $scope.tasks.length; i++) {
                  $scope.$parent.recordsNew[i].cantidad = parseInt($scope.cantidadModel || 1);
                  $scope.$parent.recordsNew[i].total = parseInt(($scope.cantidadModel || 1) * ($scope.$parent.recordsNew[i].precio_venta) );
              };
                       
             $scope.$close();
            }
         });
      }

      $scope.$watch('recordsNew', function(n, o){
          if(n.length > 0){
             $scope.total = (shoppingCart.totalize(n) - shoppingCart.totalizeDiscount(n) || 0);
             $scope.TotalIva = shoppingCart.totalizeIva(n);
             $scope.subTotal = ($scope.total - $scope.TotalIva);
             $scope.descuento =  shoppingCart.totalizeDiscount(n);
          }
      }, true); 

    $scope.$watch('_product', function(n, o){
      if(n){
         var _found = false;
          angular.forEach($scope.$parent.recordsNew, function(_o){
            if(_o._id == n){
              _found = true;

              if(_o.valor_descuento){
                _o.valor_descuento = _o.valor_descuento + _o.valor_descuento;
              }

              _o.cantidad = _o.cantidad + 1;
              _o.total = (_o.precio_venta * _o.cantidad);
            }
          }); 
          
          if(!_found){
            $scope.$parent.recordsNew.push(angular.copy(angular.extend($scope._productObj, { cantidad : 1, total : ($scope._productObj.precio_venta * 1)})));
          }

          delete $scope._product;
      }
    });

    $scope.agregarCantidad = function(){
     var _record = this.record;

       window.modal = modal.show({templateUrl : 'views/facturacion/agregar-cantidad.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
          if($scope.cantidadModel){
           $scope.$parent.recordsNew[$scope.$parent.recordsNew.indexOf(_record)].cantidad = parseInt($scope.cantidadModel || 1);
           $scope.$parent.recordsNew[$scope.$parent.recordsNew.indexOf(_record)].total = parseInt(($scope.cantidadModel || 1) * (_record.precio_venta) );           
           $scope.$close();
          }
       });
    }
  });
