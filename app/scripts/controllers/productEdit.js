'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ProductosCtrlEdit',["$scope", "$rootScope", "modal", "api", "constants", "$state", function ($scope, $rootScope, modal, api, constants, $state) {
    $scope.Records = false; 
    $scope.recordsProductos = [];
    $scope.recordsServices = [];
    
    $scope.$watch('_grocery', function(n, o){
      delete $scope.total;
      if(n){
        api.cantidades().add('stock/' + n).add('/' + $scope.formEdit._id).get().success(function(res){
          $scope.stocks = res;
          if($scope.stocks.length == 0){
            $scope.msg = 'No se encontraron movimientos en esta bodega';
          }else{
            delete $scope.msg;
          }
        });
      }
    });

    $scope.onTypeQty = function(){
      this.record.data.baseComponent = (this.record.precio * this.record.data.cantidad); 
      this.record.data.baseIva = (this.record.precio + this.record.valor_iva) * this.record.data.cantidad; 
    }

    $scope.totalizeBase = function(){
        var _total = [];
        var total = 0;

        for (var i = 0; i < $scope.recordsProductos.length; i++) {
            _total.push($scope.recordsProductos[i].data.baseComponent || $scope.recordsProductos[i].precio);
        };


        for (var y = 0; y < _total.length; y++) {
            console.log("y", _total[y])
            total = (total + _total[y])
        };

        $scope.totalBase = total;
    }

    $scope.totalizeBaseServices = function(){
        var _total = [];
        var total = 0;

        for (var i = 0; i < $scope.recordsServices.length; i++) {
            _total.push($scope.recordsServices[i].data.baseComponent || $scope.recordsServices[i].precio);
        };


        for (var y = 0; y < _total.length; y++) {
            console.log("y", _total[y])
            total = (total + _total[y])
        };

        $scope.totalBaseService = total;
    }

    $scope.totalizeBaseIva = function(){
        var _total = [];
        var total = 0;

        for (var i = 0; i < $scope.recordsProductos.length; i++) {
            _total.push($scope.recordsProductos[i].data.baseIva || ($scope.recordsProductos[i].precio + $scope.recordsProductos[i].valor_iva) * $scope.recordsProductos[i].data.cantidad || 0);
        };


        for (var y = 0; y < _total.length; y++) {
            console.log("y", _total[y])
            total = (total + _total[y])
        };

        $scope.totalBaseIva = total;
    }

    $scope.options = ['transparent','#FF8A80', '#FFD180', '#FFFF8D', '#CFD8DC', '#80D8FF', '#A7FFEB', '#CCFF90'];
    $scope.color = '#FF8A80';

    $scope.colorChanged = function(newColor, oldColor) {
        console.log('from ', oldColor, ' to ', newColor);
    }

    $scope.$watch('recordsProductos', function(n, o){
      if(n){
          $scope.totalizeBase();
          $scope.totalizeBaseIva();
      }
    });

    $scope.removefromComponentList = function(){
      $scope.recordsProductos.splice($scope.recordsProductos.indexOf(this.record), 1);
    }

    $scope.$watch('_productAdd', function(n, o){
      if(n){
            $scope.recordsProductos.push($scope._productAddObj);
            /*if($scope.formEdit){
              $scope.formEdit.data.component = $scope.recordsProductos.map(function(component){
                return {
                  _id : component._id,
                  cantidad : component.cantidad
                }
              });

              return;
            }*/

            $scope.form.data.component = $scope.recordsProductos.map(function(component){
              return {
                _id : component._id,
                cantidad : component.cantidad
              }
            });
      }
    }, true);

    //service watcher
    $scope.$watch('recordsServices', function(n, o){
      if(n){
          $scope.totalizeBaseServices();
          /*if($scope.formEdit){
            $scope.formEdit.data.precio  =  $scope.totalBaseService;
            return;
          }*/

          $scope.form.data.precio  =  $scope.totalBaseService;
      }
    }, true);

    $scope.removeServicefromComponentList = function(){
      $scope.recordsServices.splice($scope.recordsServices.indexOf(this.record), 1);
    }

    $scope.$watch('_serviceAdd', function(n, o){
      if(n){
            $scope.recordsServices.push($scope._serviceAddObj);
            if($scope.formEdit){
              $scope.formEdit.data.services = $scope.recordsServices.map(function(services){
                return {
                  _id : services._id
                }
              });

              return;
            }

            $scope.form.data.services = $scope.recordsServices.map(function(services){
              return {
                _id : services._id
              }
            });
      }
    });

    $scope.getByProduct = function(){
        $scope.total = 0;
        api.cantidades().add('stock/' + $scope.formEdit._id).get().success(function(res){
          $scope.stocks = res;
          
          $scope.stocks.map(function(stock){
            $scope.total = ($scope.total + parseInt(stock.amount));

            return stock;
          });

          if($scope.stocks.length == 0){
            $scope.msg = 'No se encontraron movimientos en esta bodega';
          }else{
            delete $scope.msg;
          }
        });
    }

    $scope.detail = function(){
      var url = $state.href('dashboard.detalle_producto', { producto : $rootScope.grid.value._id});
      window.open(url, '_blank');
    }

    $scope.edit = function(){
      $scope.formEdit = angular.copy(this.record);
      $scope.formEdit._category = this.record._category ? this.record._category._id : null;
      $scope.formEdit._commercial_home = this.record._commercial_home ? this.record._commercial_home._id : null;
      $scope.ivaValue = this.record._iva ? this.record._iva.data.valor : 0;

      $scope.formEdit._iva = this.record._iva ? this.record._iva._id : null;
      
      if($scope.formEdit.data.tags){
        $scope.tags = $scope.formEdit.data.tags.map(function(o){
            var _obj = new Object();
            _obj.text = o;
            _obj.value = o;

            return _obj;
        });        
      }

      if($scope.formEdit._reference.reference){
          $scope.reference = $scope.formEdit._reference.reference.map(function(o){
              var _obj = new Object();
              _obj.text = o;
              _obj.value = o;

              return _obj;
          });
      }

      if($scope.formEdit.data.component){
        $scope.recordsProductos = $scope.formEdit.data.component.map(function(o){
          var _obj = new Object();
              _obj = o._id.data;
              _obj.data = {};
              _obj.data.cantidad = o.cantidad;
              _obj.iva = o._id._iva;
              _obj._reference = o._id._reference;
              _obj._category = o._id._category;
              _obj._id = o._id;
              _obj.idcomposed = o._id.idcomposed;
              
              return _obj; 
        })
      } 

      window.modal = modal.show({templateUrl : 'views/productos/editar_producto.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
            if($scope.formProductoEdit.$invalid){
                 modal.incompleteForm();
                return;
            }

            console.log("data", $scope.formEdit)

            api.producto($scope.formEdit._id).put($scope.formEdit).success(function(res){
                if(res){
                    sweetAlert("Registro Modificado", "Registro modificado correctamente.", "success");
                    $scope.load();
                    $scope.$close();
                    delete $scope.form.data;
                }
            });
      });
    }

    $scope.$watch('form.data.precio', function(n, o){
      try{
        var _valor_iva = ((parseInt($scope.iva ? $scope.iva.valor : 0) / 100) * $scope.form.data.precio  || 0); 
        var _valor_utilidad = ((($scope.form.data.utilidad || 0)  / 100) * $scope.form.data.precio  || 0);

        $scope.form.data.valor_utilidad = _valor_utilidad;
        $scope.form.data.valor_iva = _valor_iva;

        $scope.form.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.form.data.precio);        
      }catch(e){}

    });


    $scope.$watch('iva.valor', function(n, o){
      try{
        $scope.form.data.valor_iva = ($scope.form.data.precio + $scope.form.data.valor_utilidad ) * (parseInt(n) / 100);
        $scope.form.data.precio_venta = (
                                        $scope.form.data.valor_iva + ($scope.form.data.precio) 
                                        + ($scope.form.data.valor_utilidad )
                                      )        
      }catch(e){}

    });

    $scope.$watch('form.data.utilidad', function(n, o){
      try{
        $scope.form.data.valor_utilidad = ($scope.form.data.precio * ($scope.form.data.utilidad / 100)); 
        $scope.form.data.precio_venta = (
                                $scope.form.data.valor_iva + 
                                $scope.form.data.valor_utilidad  + 
                                $scope.form.data.precio
                                );        
      }catch(e){}

    });

    $scope.editLoad = function(){
      if($scope.stocks && $scope.stocks.length > 0){
        delete $scope.stocks;
      }

      if($scope._grocery){
        delete $scope._grocery;

      }

       $scope.$watch('formEdit.data.precio', function(n, o){
        try{
          var _valor_iva = ((parseInt($scope.EditIva ? $scope.EditIva.valor  : 0  || $scope.ivaValue) / 100) * $scope.formEdit.data.precio  || 0); 
          
          var _valor_utilidad = ((($scope.formEdit.data.utilidad || 0)  / 100) * $scope.formEdit.data.precio  || 0);

          $scope.formEdit.data.valor_utilidad = _valor_utilidad;
          $scope.formEdit.data.valor_iva = _valor_iva;

          $scope.formEdit.data.precio_venta = (_valor_iva + _valor_utilidad + $scope.formEdit.data.precio);    

        }catch(e){
              console.log("error", e);
        }

      });

      $scope.$watch('EditIva.valor', function(n, o){
          try{

            if(!n && !o){
              $scope.formEdit.data.valor_iva = (($scope.formEdit.data.precio + $scope.formEdit.data.valor_utilidad) * (parseInt($scope.ivaValue) / 100));
            }else{
             $scope.formEdit.data.valor_iva = ($scope.formEdit.data.precio * (parseInt(n || 0) / 100));
            }

            //$scope.formEdit.data.valor_iva = ($scope.formEdit.data.precio * (parseInt(n) / 100));
            $scope.formEdit.data.precio_venta = (
                                            $scope.formEdit.data.valor_iva + ($scope.formEdit.data.precio) 
                                            + ($scope.formEdit.data.valor_utilidad )
                                          )        
          }catch(e){
              console.log("error", e);
          }        
      });

      $scope.$watch('formEdit.data.utilidad', function(n, o){
        try{
          $scope.formEdit.data.valor_utilidad = ($scope.formEdit.data.precio * ($scope.formEdit.data.utilidad / 100)); 
          $scope.formEdit.data.precio_venta = (
                                  $scope.formEdit.data.valor_iva + 
                                  $scope.formEdit.data.valor_utilidad  + 
                                  $scope.formEdit.data.precio
                                  );        
        }catch(e){
          console.log("error", e);
        }

      });          
    }

    $scope.create = function(){
      api.bodega().get().success(function(res){
          if(res.length == 0){
            sweetAlert("No Existen Bodegas", "Debe existir almenos una bodega", "error");
            return ;
          }else{
             window.modal = modal.show({templateUrl : 'views/productos/agregar-producto.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
                  if($scope.formProducto.$invalid){
                       modal.incompleteForm();
                      return;
                  }

                  api.producto().post($scope.form).success(function(res){
                      if(res){
                          $scope.load();
                          $scope.$close();
                          delete $scope.form.data;
                          sweetAlert("Registro completado.", "has registrado un nuevo producto.", "success");
                      }
                  }).error(function(data, status){
                    if(status == 409){
                      sweetAlert("Referencia duplicada", "La referencia: "+ data.reference+" ya existe", "warning");
                    }
                  });
              });            
          }
      });

    }

    $scope.delete = function(){
        var _record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.producto(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }
  } ] );
