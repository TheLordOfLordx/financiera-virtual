'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.constants
 * @description
 * # constants
 * Constant in the shoplyApp.
 */
angular.module('shoplyApp')
  .constant('constants', {
  	base_url : "http://www.shoply.com.co:8080/api/",
    socket : "http://shoply.com.co:8080",                          
  	login_state_sucess : 'dashboard',
    uploadURL : "http://www.shoply.com.co:8080/api/uploads",
    base_resource : "http://www.shoply.com.co:8080/api/resource/",
  	currency  : 'COP',
  	iva : [{valor :5, text : "5%"}, {valor :10, text : "10%"}],
  	request_status : [{status : "Despachado"}, {status : "Facturado"} ,{status:"Pendiente"},{ status : "Observación"}],
  	product_status : [{status : "Habilitado"}, {status : "Inhabilitado"}],
  	enable_social_auth : false,
    company : {
      company_name : 'Mi Empresa',
      company_address : 'cra 25A#35-56',
      company_phone : '(+57) 301 290 4420',
      company_email : 'company@gmail.com',      
      company_fax : 'company@gmail.com'      
    }
  });
 