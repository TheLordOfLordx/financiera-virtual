'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('FacturacionCtrl',["$scope", "hotkeys", "shoppingCart", "modal", "api", "constants","sweetAlert", "$rootScope", "$http", "$filter", "$stateParams", "storage","$timeout","$state",  function ($scope, hotkeys, shoppingCart,  modal, api, constants, sweetAlert, $rootScope, $http, $filter, $stateParams, $storage, $timeout, $state) {
    
    $scope.records = [];
    $scope.total = 0;

    $scope.$watch('records', function(n, o){
       $scope.totalize(n);       
       $scope.totalizeBases(n);       
       $scope.totalizeDiscount(n);       
       $scope.totalizeIva(n);       
    }, true);

    $scope.totalize = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalize(n).length; i++) {
            total = (total + shoppingCart.totalize(n)[i])
        };

        $scope.total = total;
    }

    $scope.totalizeIva = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeIva(n).length; i++) {
            total = (total + shoppingCart.totalizeIva(n)[i])
        };

        $scope.TotalIva = total;
    }

    $scope.totalizeBases = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeBases(n).length; i++) {
            total = (total + shoppingCart.totalizeBases(n)[i])
        };

        $scope.subTotal = total;
    }

    $scope.totalizeDiscount = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeDiscount(n).length; i++) {
            total = (total + shoppingCart.totalizeDiscount(n)[i])
        };

        $scope.descuento = total;
    }

    $scope.load = function(){
       api.arqueos().add("find/").post({
        _seller : $rootScope.user._id,
        ini :  moment(new Date()).startOf('day').format()
       }).success(function(res){
         if(res.length > 0){
            sweetAlert.swal("Error", "No puede facturar debido a que ya existe un arqueo para este dia", "error");
            $state.go('dashboard');
         }
       })

      $scope.records =[];
      if($stateParams.facturacion){
        api.facturacion($stateParams.facturacion).get().success(function(res){
          $scope.rs = res;
          $scope.records = $scope.rs._product;
          $scope.form._client = res._client;
        });
      }else if($stateParams.pedido){
        api.pedido($stateParams.pedido).get().success(function(res){
          $scope.pedido = res;
        });

        $scope.myGroceries = $rootScope.user._grocery.map(function(o){
        
        var _obj = new Object();
              _obj.name = o.data.bodega;
              _obj._id = o._id;
              return _obj; 
        }) || [];

        $scope.myConfig = {
          valueField: "_id",
          labelField: "name",
          placeholder: 'Bodega para descargar',
          selectOnTab : true,
          allowEmptyOption: $scope.emptyOption,
          maxItems  : 1,
        };

        var _curScope = $scope;

         modal.show({templateUrl : 'views/facturacion/selectGrocery.html', size :'sm', scope: $scope, backdrop:'static', windowClass : 'modal-center'}, function($scope){
            if($scope._grocery){
                api.pedido($stateParams.pedido).get().success(function(res){
                  console.log($scope)
                  _curScope.grocery = $scope.myGroceries.filter(function(grocery){ return grocery._id == $scope._grocery})[0].name;
                  toastr.success('descargando de : ' + $scope.myGroceries.filter(function(grocery){ return grocery._id == $scope._grocery})[0].name);
                  _curScope.pedido = res;
                  _curScope.records = res.shoppingCart || [];
                  _curScope.form._client = res._client._id;
                });

                $scope.$close();                  
            }
         });
        
      }else{
        $scope.setDefault = $storage.get('defaultClient') || null;
        $rootScope.$emit("focusOn", true);


        $scope.myGroceries = $rootScope.user._grocery.map(function(o){
          var _obj = new Object();
              _obj.name = o.data.bodega;
              _obj._id = o._id;
              return _obj; 
        }) || [];

        $scope.selectGrocery();                      
      }
    }

    $scope.selectGrocery = function(){
        $scope.myConfig = {
          valueField: "_id",
          labelField: "name",
          placeholder: 'Bodega para descargar',
          selectOnTab : true,
          allowEmptyOption: $scope.emptyOption,
          maxItems  : 1,
        };

         modal.show({templateUrl : 'views/facturacion/selectGrocery.html', size :'sm', scope: $scope, backdrop:'static', windowClass : 'modal-center'}, function($scope){
            if($scope._grocery){
                $scope.$parent.grocery = $scope.myGroceries.filter(function(grocery){ return grocery._id == $scope._grocery})[0].name;
                toastr.success('descargando de : ' + $scope.myGroceries.filter(function(grocery){ return grocery._id == $scope._grocery})[0].name);
                $scope.$close();
            }
         }); 
    }

    $scope.setDefaultClient = function(){
        if(this.defaultOption){
          $storage.save('defaultClient', $scope.form._client);
        }else{
          $storage.delete('defaultClient');
        }
    }

    $scope.printA = function(data, iva_detail){
      Handlebars.registerHelper('formatCurrency', function(value) {
          return $filter('currency')(value);
      });

      $http.get('views/invoice/invoice_88mm.html').success(function(res){
        var _template = Handlebars.compile(res);
        var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
        
        w.document.write(_template(data));
        w.print();
        w.close();
      });
    }

    $scope.setReceived = function(){
      var total = 0;

      angular.forEach($scope.paymentMethods, function(o){
        if(o.data.value){
            total = (total + o.data.value)
          }
      });

      $scope.received = total;

      var _sum = ($scope.totalParcial - $scope.received);

      if(_sum < 0){
          $scope.change = _sum * (-1) ;
      }else{
        $scope.change = 0;
      }

      if(this.method.data.requiredCode || this.method.data.card || this.method.data.credito){
        if(this.method.data.value > $scope.totalParcial){
          sweetAlert.swal("Ups", "Este metodo de pago no factura valores mayores al total.", "warning");
          delete this.method.data.value;
        }
      }

      if(!this.method.data.requiredCode && !this.method.data.card && !this.method.data.credito){
          this.method.data.totalEfectivo = (this.method.data.value - $scope.change);
      } 
    }

    $scope.getPaymentMethods = function(){
      if($stateParams.facturacion){
        $scope.paymentMethods = $scope.rs._payments;
        $scope.loading = false;
      }else{
        $scope.loading = true;
        api.formas_pagos().get().success(function(res){
          $scope.$parent.paymentMethods = res ||[];
          $scope.loading = false;
        });        
      }
    }

    $scope.openBaseForm = function(event, value){
      $scope.totalCard = value;
      $scope.method = this.method;

      if(this.method.data.card){
        if(event.which === 13) {
           window.modal = modal.show({templateUrl : 'views/facturacion/baseForm.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
              $scope.method.data.base =  ( $scope.totalCard / 1.16);
              $scope.method.data.Iva = ($scope.totalCard) - ( $scope.totalCard / 1.16);
              $scope.$parent.$parent.form._payments = $scope.paymentMethods;
              $scope.$close();
           }, function(){

           }); 
        }
      }
    }

    $scope.$watch('gdiscount', function(n, o){
      if(n || o){
        $scope.vgdescuento =  ($scope.total * $scope.gdiscount / 100);
        $scope.totalParcial = (angular.copy($scope.total) - ($scope.vgdescuento))        
      }
    });

    $scope.getExistencias = function(){
      $scope.record = this.record;
        api.cantidades().add('stock/' + $scope._grocery).add('/' +  $scope.record._id).get().success(function(res){
            console.log("response", res);
            for (var i = 0; i < res.length; i++) {
                   $scope.record.existencias = ( $scope.record.existencias || 0)  + (res[i].amount);
            };
        });
    }

    $scope.facturar = function(as){
      if($scope.records == 0){
        return;
      }
      
       window.modal = modal.show({templateUrl : 'views/facturacion/agregar_facturacion.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.form.data =  new Object();
          $scope.form._seller = $rootScope.user._id;
          $scope.form.data.TotalIva = $scope.TotalIva;
          $scope.form.data.total = $scope.totalParcial;
          $scope.form.data.subtotal =  $scope.subTotal;
          $scope.form.data.change = $scope.$$childTail.change;
          $scope.form.data.received = $scope.$$childTail.received;
          $scope.form.data._grocery = $scope._grocery;

          $scope.form.data.descuentoGlobal = $scope.gdiscount || 0;
          $scope.form.data.valorDescuentoGlobal = $scope.vgdescuento;
          $scope.form._payments = $scope.paymentMethods;
          $scope.form.data.descuento = 0;

          $scope.form._product = $scope.records.map(function(o){
              delete o.$order;

              if(!o.descuento){
                o.descuento = 0;
              }

              $scope.form.data.descuento = ($scope.form.data.descuento + parseInt(o.descuento || 0))
              return o;
          });

          api.ivas().get().success(function(res){
              var _filteredByIvas = [];
              $scope.form.data.ivadetails = [];
              
              angular.forEach(res, function(o){
                _filteredByIvas.push($scope.form._product.filter(function(i){
                      if(!i.iva){
                        i.iva = new Object();
                        i.iva.data = new Object();                        
                        i.iva.data.valor = 0;                        
                      }

                      return i.iva.data.valor == o.data.valor;
                  }));
              });

              angular.forEach(_filteredByIvas, function(o){
                if(o.length > 0){
                    var _SUM = new Object();
                    _SUM.total = 0;
                    _SUM.viva = 0;

                    angular.forEach(o, function(_o){
                        _SUM.tipo = _o.iva.data.valor;
                        _SUM.total =  ((_o.precio_venta  * _o.cantidad) - (_o.descuento || 0 * _o.cantidad)) +  _SUM.total;
                    });

                    var ivadec =  (_SUM.tipo  / 100) + 1;
                    _SUM.base = (_SUM.total  / ivadec);
                    _SUM.viva = (_SUM.total - _SUM.base);

                    $scope.form.data.ivadetails.push(_SUM);                  
                }
              })

              if($stateParams.pedido){
                  $scope.form._seller = $rootScope.user._id;
                  $scope.form.data.TotalIva = $scope.TotalIva;
                  $scope.form.data.total = $scope.totalParcial;
                  $scope.form.data.subtotal =  $scope.subTotal;
                  $scope.form.data.change = $scope.$$childTail.change;
                  $scope.form.data.received = $scope.$$childTail.received;
                  $scope.form.data._grocery = $scope._grocery;
                  $scope.form.data.descuentoGlobal = $scope.gdiscount || 0;
                  $scope.form.data.valorDescuentoGlobal = $scope.vgdescuento;
                  $scope.form._payments = $scope.paymentMethods;
                  $scope.form.data.descuento = 0;
                  $scope.form.data.tipo = $scope.pedido.data.tipo;
                  $scope.form.data.estado = as;
                  
                  api.facturacion().post($scope.form).success(function(res){
                    if(res){
                        delete $scope.form;
                        delete $scope.rs;
                        $scope.records.length = 0;
                        res.createdAt = moment(new Date(res.createdAt)).format('lll');
                        $scope.printA(res);
                        $scope.$close();
                        sweetAlert.swal("Listo.", "Venta realizada correctamente.", "success");
                        $rootScope.$emit("focusOn", true);
                        api.pedido($stateParams.pedido).add("/facturado").put().success(function(res){
                          console.log(res)
                          toastr.success('Pedido Actualizado');
                        });                         
                    }
                  });
              }else{
                $scope.form.data.estado = as;
                api.facturacion().post($scope.form).success(function(res){
                  if(res){
                      delete $scope.form;
                      $scope.records.length = 0;
                      res.createdAt = moment(new Date(res.createdAt)).format('lll');
                      console.log("response", res);
                      $scope.printA(res);
                      $scope.$close();
                      sweetAlert.swal("Listo.", "Venta realizada correctamente.", "success");
                      $rootScope.$emit("focusOn", true);
                  }
                });                
              }
          });
       });  
    }

    $scope.agregarCantidad = function(){
        $scope._record = this.record;

       window.modal = modal.show({templateUrl : 'views/facturacion/agregar-cantidad.html', size :'sm', scope: $scope, backdrop:'static', windowClass : 'modal-center'}, function($scope){
          if($scope.cantidadModel){
              if($scope.cantidadModel  >  $scope._record.existencias){
                toastr.warning('No existe esta cantidad en bodega para esta venta');
                return;
              }

              $scope._record.cantidad = parseInt($scope.cantidadModel);
              $scope._record.precio_baseFacturado = (($scope._record.precio + $scope._record.valor_utilidad) * $scope.cantidadModel);
              $scope._record.precio_VentaFacturado = (($scope._record.precio_venta) * $scope.cantidadModel);
              $scope._record.ivaFacturado =  ($scope._record.precio_VentaFacturado - $scope._record.precio_baseFacturado);
              $scope._record.descuento = ($scope._record.precio_venta * parseInt($scope._record.porcentajeDTO) * $scope._record.cantidad) / 100;
              $scope._record.precio_VentaFacturado = ( $scope._record.precio_VentaFacturado || $scope._record.precio_venta -  $scope._record.descuento);

              //$scope.$parent.total = shoppingCart.totalize($scope.records);
              //$scope.$parent._record.hasAddedQty = true;
              $scope.$close();              
          }
       });
    }

    $scope.agregarDescuento = function(){
     $scope.descuentoRecord = this.record;

     window.modal = modal.show({templateUrl : 'views/facturacion/descuento.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
        if($scope.pdiscount){
          $scope.descuentoRecord.porcentajeDTO = $scope.pdiscount;

          $scope.descuentoRecord.descuento = ($scope.descuentoRecord.precio_venta * parseInt($scope.pdiscount) * $scope.descuentoRecord.cantidad) / 100;
          $scope.descuentoRecord.precio_VentaFacturado = ($scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.descuento)
          $scope.descuentoRecord.precio_baseVlFacturado = (($scope.descuentoRecord.precio_baseFacturado || ($scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad)   * $scope.pdiscount) / 100);
          $scope.descuentoRecord.ivaFacturado = $scope.descuentoRecord.ivaFacturado - (($scope.descuentoRecord.ivaFacturado * $scope.pdiscount) / 100);
          $scope.descuentoRecord.precio_baseFacturado = ( $scope.descuentoRecord.precio_baseFacturado || $scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad) - ( $scope.descuentoRecord.precio_baseFacturado || $scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad) * $scope.pdiscount / 100;
          $scope.descuentoRecord.vlUnicoD = ($scope.descuentoRecord.total * $scope.pdiscount) / 100;
          $scope.descuentoRecord.vlUnicoP = ($scope.descuentoRecord.total - $scope.descuentoRecord.vlUnicoD);
          $scope.$close();

        }

        if($scope.pdiscountPesos){
          $scope.descuentoRecord.pesosDTO = $scope.pdiscountPesos;
          $scope.descuentoRecord.descuento = $scope.pdiscountPesos;

          $scope.descuentoRecord.precio_VentaFacturado = ($scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.descuento)
          $scope.descuentoRecord.precio_baseFacturado = ($scope.descuentoRecord.precio_VentaFacturado) / (($scope.descuentoRecord.iva.data.valor / 100) + 1) ;
          
          $scope.descuentoRecord.ivaFacturado =  $scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.precio_baseFacturado;
          $scope.$close();
        }
        
     });
    }

    $scope.agregarDescuentoGlobal = function(){
     window.modal = modal.show({templateUrl : 'views/facturacion/descuento.html', size :'sm', scope: $scope, backdrop:'static'}, function($scope){
        if($scope.pdiscount){
          $scope.$parent.descuentoGlobal = (($scope.$parent.$parent.total * $scope.pdiscount) / 100);
          console.log("descuentoGloabl", $scope.$parent.descuentoGloabal);
          $scope.total = $scope.total - $scope.$parent.$parent.descuentoGlobal;
          console.log("total", $scope.$parent.$parent.total);
          $scope.$close();
        }

        if($scope.pdiscountPesos){
         
          $scope.$close();
        }
        
     });
    }

    $scope.$watch('_product', function(n, o){
      if(n){
        if($scope._productObj.negativo){
              $scope.records.push(angular.copy(angular.extend($scope._productObj,
               { cantidad : 1,
                precio_baseFacturado : ($scope._productObj.precio + $scope._productObj.valor_utilidad),
                precio_VentaFacturado : $scope._productObj.precio_venta,
                ivaFacturado : ($scope._productObj.precio_venta - ($scope._productObj.precio + $scope._productObj.valor_utilidad)),
                total : $scope._productObj.precio_venta, 
                descuento : 0,
                vlUnicoD : 0,
                vlUnicoP : $scope._productObj.precio_venta

              })));
              //$scope.total = shoppingCart.totalize($scope.records);
              delete $scope._product;

              return;  
        }

        api.cantidades().add('stock/' + $scope._grocery).add('/' +  n).get().success(function(res){
            if(res.length == 0){
                toastr.warning("este producto no esta disponible en bodega");
                delete $scope._product;              
            }else{
              $scope.records.push(angular.copy(angular.extend($scope._productObj,
               { cantidad : 1,
                precio_baseFacturado : ($scope._productObj.precio + $scope._productObj.valor_utilidad),
                precio_VentaFacturado : $scope._productObj.precio_venta,
                ivaFacturado : ($scope._productObj.precio_venta - ($scope._productObj.precio + $scope._productObj.valor_utilidad)),
                total : $scope._productObj.precio_venta, 
                descuento : 0,
                vlUnicoD : 0,
                vlUnicoP : $scope._productObj.precio_venta

              })));
              //$scope.total = shoppingCart.totalize($scope.records);
              delete $scope._product;              
            }
        });
      }
    });

    $scope.delete = function(){
        var _record = this.record;
        $scope.records.splice($scope.records.indexOf(_record), 1);
        //$scope.total = shoppingCart.totalize($scope.records);
    }
  } ] );
