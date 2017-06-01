'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.api
 * @description
 * # api
 * Service in the shoplyApp.
 */
angular.module('shoplyApp')
  .service('api', function ($http, constants) {
    this.get = function(){ var url = this.url; this.reset(); return $http.get(url); };
    this.post = function(data, header){  var url = this.url; this.reset(); return $http.post(url, data || {}, header || { headers : {'Content-Type': 'application/json'} }); };
    this.put = function(data){ var url = this.url; this.reset(); return $http.put(url, data || {}); } ;  
    this.delete = function(){ var url = this.url; this.reset(); return $http.delete(url); };
    
    this.Headers = null;

    this.add = function(comp){ this.url += comp; return this;  };
    this.headers = function(headers){ this.Headers = headers; return this;  };
    this.reset = function(){ this.url = ""; };

    this.user = function(user){if(user) this.url = constants.base_url + "user/" + user; else this.url = constants.base_url + "user/"; return this;};
    this.recover = function(){ this.url = constants.base_url + "recover/"; return this;};
    this.reset_password = function(){ this.url = constants.base_url + "reset/"; return this;};
    this.verification_code = function(){ this.url = constants.base_url + "user/verification-code/"; return this;};
    this.permiso = function(permiso){if(permiso) this.url = constants.base_url + "permisos/" + permiso; else this.url = constants.base_url + "permisos/"; return this;};
    this.bodega = function(bodega){if(bodega) this.url = constants.base_url + "bodegas/" + bodega; else this.url = constants.base_url + "bodegas/"; return this;};
    this.entradas = function(entrada){if(entrada) this.url = constants.base_url + "entradas/" + entrada; else this.url = constants.base_url + "entradas/"; return this;};
    this.salidas = function(salida){if(salida) this.url = constants.base_url + "salidas/" + salida; else this.url = constants.base_url + "salidas/"; return this;};
    this.producto = function(producto){if(producto) this.url = constants.base_url + "producto/" + producto; else this.url = constants.base_url + "producto/"; return this;};
    this.pedido = function(pedido){if(pedido) this.url = constants.base_url + "pedido/" + pedido; else this.url = constants.base_url + "pedido/"; return this;};
    this.rutas = function(ruta){if(ruta) this.url = constants.base_url + "rutas/" + ruta; else this.url = constants.base_url + "rutas/"; return this;};
    this.metadata = function(entity){if(entity) this.url = constants.base_url + "metadata/" + entity; else this.url = constants.base_url + "entity/"; return this;};
    this.ivas = function(iva){if(iva) this.url = constants.base_url + "ivas/" + iva; else this.url = constants.base_url + "ivas/"; return this;};
    this.formas_pagos = function(formaPago){if(formaPago) this.url = constants.base_url + "formasPago/" + formaPago; else this.url = constants.base_url + "formasPago/"; return this;};
    this.casa_comercial = function(casa_comercial){if(casa_comercial) this.url = constants.base_url + "casa-comercial/" + casa_comercial; else this.url = constants.base_url + "casa-comercial/"; return this;};
    this.facturacion = function(factura){if(factura) this.url = constants.base_url + "facturacion/" + factura; else this.url = constants.base_url + "facturacion/"; return this;};
    this.referencias = function(referencia){if(referencia) this.url = constants.base_url + "referencias/" + referencia; else this.url = constants.base_url + "referencias/"; return this;};
    this.contadores = function(contador){if(contador) this.url = constants.base_url + "contadores/" + contador; else this.url = constants.base_url + "contadores/"; return this;};
    this.cantidades = function(){ this.url = constants.base_url + "cantidades/"; return this;};
    this.transportador = function(transportador){if(transportador) this.url = constants.base_url + "transportador/" + transportador; else this.url = constants.base_url + "transportador/"; return this;};
    this.categoria = function(categoria){if(categoria) this.url = constants.base_url + "categoria/" + categoria; else this.url = constants.base_url + "categoria/"; return this;};
    this.producciones = function(produccion){if(produccion) this.url = constants.base_url + "producciones/" + produccion; else this.url = constants.base_url + "producciones/"; return this;};
    this.lotes = function(lote){if(lote) this.url = constants.base_url + "lotes/" + lote; else this.url = constants.base_url + "lotes/"; return this;};
    this.empresa = function(empresa){if(empresa) this.url = constants.base_url + "empresa/" + empresa; else this.url = constants.base_url + "empresa/"; return this;};
    this.arqueos = function(arqueo){if(arqueo) this.url = constants.base_url + "arqueos/" + arqueo; else this.url = constants.base_url + "arqueos/"; return this;};
    this.apps = function(app){if(app) this.url = constants.base_url + "apps/" + app; else this.url = constants.base_url + "apps/"; return this;};
    this.upload = function(){ this.url = constants.uploadURL; return this};
    this.uploadLocal = function(){ this.url = constants.base_url + "upload-local/"; return this};
    this.s3 = function(){ this.url = constants.base_url + "upload-amazon/"; return this};
    
    return this;
  });
