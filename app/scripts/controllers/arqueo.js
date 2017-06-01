'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # CompanyCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ArqueoCtrl', function ($scope, $http, $filter,  $rootScope, $stateParams, sweetAlert, constants, $state, modal, api, storage) {
    
    $scope.MainRecords = false; 

    $scope.form = new Object();
    $scope.form.metadata = {};
    $scope.form.metadata.total_sistema = 0;

    $scope.load = function(){
        if($stateParams.employee){
            $scope._sellerParam = $stateParams.employee;      
        }

        if($stateParams.highlight){
          $scope.highlight = $stateParams.highlight;
        }

        if($stateParams.arqueo){
          api.arqueos($stateParams.arqueo).get().success(function(res){
            $scope.form._request = res._request || [];
            $scope.form.metadata = res.metadata;
            $scope.MainRecords = true;
          });   
        }else{
          api.arqueos().get().success(function(res){
            $scope.records = res || [];
            $scope.MainRecords = true;
          });          
        }
  	}

    $scope.totalizePayments = function(){
       this.record.total = 0;
       
      for (var i = 0; i < $scope.allPayments.length; i++) {
            if(this.record.data.descripcion == $scope.allPayments[i].data.descripcion){
              if($scope.allPayments[i].data.totalEfectivo){
                 this.record.total = this.record.total + ($scope.allPayments[i].data.totalEfectivo);
              }else{
                  this.record.total = this.record.total + ($scope.allPayments[i].data.value);
              }
            }
      }
    }

    $scope.totalizeBill = function(){
      $scope.allPayments = [];
      
      for (var i = 0; i < $scope.$parent.form._billings.length; i++) {
          console.log($scope.$parent.form._billings)
         
         $scope.allPayments = $scope.allPayments.concat($scope.$parent.form._billings[i]._payments.filter(function(obj){
            return obj.data.value;
         }));
      };
    }

    $scope.verArqueo = function(){
      $scope.payments = this.record.data.payments;
      
      window.modal = modal.show({templateUrl : 'views/arqueos/ver-arqueo.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
          $scope.$close();
      });
    }

    $scope.verFacturaciones = function(){
      $scope._billings = this.record._request;
      window.modal = modal.show({templateUrl : 'views/arqueos/ver-facturaciones.html', size :'lg', scope: $scope, backdrop:'static'}, function($scope){
          
          $scope.$close();
      });
    }

    $scope.guardarArqueo = function(){
      window.modal = modal.show({templateUrl : 'views/arqueos/guardar-arqueo.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        sweetAlert.swal({
            title: "Confirmar Movimiento!",
            text: "Escribe algo referente al movimiento.",
            type: "input",
            showCancelButton: false,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Nombre del Movimiento" 
          }, function(inputValue){
              if (inputValue === false) return false; 
              console.log($scope)
              if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false   
              } 
              
              var _data = {};
              _data.data = {};

              _data._seller = $scope.$parent.$parent.formData._seller;
              _data.data.arqueo = inputValue;
              _data.data.payments = $scope.$parent.payments;
              _data.ini = moment($scope.$parent.$parent.formData.ini).startOf('day').format();
              _data.end = moment($scope.$parent.$parent.formData.end).endOf('day').format();

              _data._request = $scope.$parent.form._billings.map(function(o){
                return o._id;
              });

              console.log("data para el arqueo", _data);

              api.arqueos().post(_data).success(function(res){
                if(res){
                   sweetAlert.swal("Registro Creado", "Registro creado correctamente.", "success");
                   $scope.form._billings = [];
                   $scope.$close();
                   $state.go('dashboard.arqueos', {highlight : res._id});
                }
              });
            
            });
      });
    }

    $scope.verImpuestos = function(ivs){
      $scope.records = this.record.data.ivadetails;
      window.modal = modal.show({templateUrl : 'views/iva/verIvas.html', size :'md', scope: $scope, backdrop:'static'}, function($scope){
        $scope.$close();
      });
    }

    $scope.create = function(){
      $state.go('dashboard.crear-arqueo');
    }

    $scope.download = function(){
      alert(1);
      /*$scope._schema = $scope.form._billings.map(function(o){
          var _output = new Object();

           _output.vendedor = o._seller ? o._seller.full_name.full_name : 'no definido'; 
           _output.fecha = new Date(o.createdAt).toISOString().substr(0,10); 
           _output.Cliente = o._client ? o._client.full_name : 'no definido'; 
           _output.total = o.data.total.toString();

          return _output; 
      });

      var data1 = $scope._schema;
      var data2 = [$scope.form.metadata];
      var opts = [{sheetid:'Facturacion',header:true},{sheetid:'Arqueo',header:false}];
      var res = alasql('SELECT INTO XLSX("Arqueo.xlsx",?) FROM ?',[opts,[data1,data2]]);*/
  
    }

    $scope.downloadOnLIst = function(){
      $scope._schema = $scope.form._billings.map(function(o){
          var _output = new Object();

           _output.vendedor = o._seller.full_name; 
           _output.fecha = new Date(o.createdAt).toISOString().substr(0,10); 
           _output.Cliente = o._client.full_name; 
           _output.total = o.data.total.toString();

          return _output; 
      });

    var data1 = $scope._schema;
    var data2 = [$scope.form.metadata];
    var opts = [{sheetid:'Pedidos',header:true},{sheetid:'Facturacion',header:false}];
    var res = alasql('SELECT INTO XLSX("Arqueo.xlsx",?) FROM ?',[opts,[data1,data2]]);
  
    }




    $scope.find = function(){
       $scope.formData = $scope.formData || {};
       $scope.formData.ini = $scope.formData.ini ? moment($scope.formData.ini).startOf('day').format() : undefined;
       $scope.formData.end = $scope.formData.end ? moment($scope.formData.end).endOf('day').format() : undefined;

       api.arqueos().add("find/").post($scope.formData).success(function(res){
         if(res.length > 0){
            sweetAlert.swal("Arqueo Existente", "Ya existe un arqueo para este usuario en esta fecha", "error");
            delete $scope.formData;
            delete $scope.formD;
         }else if(res.length == 0){
             $scope.Records = true;
             $scope.formData = $scope.formData || {};
             $scope.formData.ini = moment($scope.formData.ini).startOf('day').format();
             $scope.formData.end = moment($scope.formData.end).endOf('day').format();

             api.facturacion().add("find/").post($scope.formData).success(function(res){
                  if(res.length > 0){
                    $scope.form._billings = res || [];
                    $scope.form.metadata.total_sistema = 0;
                    $scope.form.metadata.sobrante = 0;
                    $scope.form.metadata.faltante = 0;
                    $scope.totalize();
                    $scope.formasDePagos = [];
                    $scope.ffp = [];
                    $scope.Records = false;
                    delete $scope.formData;

                    api.formas_pagos().get().success(function(fp){
                        $scope.payments = fp;

                        angular.forEach(fp, function(payment){
                            angular.forEach($scope.form._billings, function(bill){
                                  $scope.formasDePagos.push({id : payment.data.descripcion, values : bill._payments.filter(function(pay){return pay._id == payment._id && pay.data.value;})});
                            });
                        });
                    });

                  }else{
                      sweetAlert.swal("0 Resultados", "No se encontraron registros para este usuario", "error");
                      delete $scope.formData;
                      $scope.form._billings  =  $scope.form._billings || [];
                      $scope.Records = false;
                  }
                });          
         }
       });


    }

    $scope.print = function(data){
        Handlebars.registerHelper('formatCurrency', function(value) {
            return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        });

        Handlebars.registerHelper("DateShort", function(timestamp) {
            return  $filter('date')(timestamp, 'yyyy-MM-dd');
        });

        $http.get('views/prints/arqueo.html').success(function(res){
          var _template = Handlebars.compile(res);
          var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
          
          w.document.write(_template($scope.records));
          w.print();
          w.close();
        });
    }

    $scope.totalize = function(){
      angular.forEach($scope.form._billings, function(o){
        $scope.form.metadata.total_sistema += o.data.total || 0;
      });
    }

    $scope.$watch("form.metadata.total_efectivo", function(n, o){
        if(($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo || 0)  < 0){
            $scope.form.metadata.sobrante = ($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo) * (-1);
            $scope.form.metadata.faltante = 0;
        }else{
           $scope.form.metadata.faltante = ($scope.form.metadata.total_sistema - $scope.form.metadata.total_efectivo || 0);
           $scope.form.metadata.sobrante = 0;
        }
    });

    $scope.borrar = function(){
        var _record = this.record;
        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.arqueos(_record._id).delete().success(function(res){
                        if(res){
                            $scope.records.splice($scope.records.indexOf(_record), 1);
                        }
                    });
               }
           })
    }

  });
