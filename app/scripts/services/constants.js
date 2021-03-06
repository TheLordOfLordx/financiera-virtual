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
  	base_url : "https://13.59.230.244/api/",
    socket : "https://www.daimont.com:8080",                          
  	login_state_sucess : 'dashboard',
    uploadURL : "http://www.daimont.com:8080/api/uploads",
    base_resource : "http://www.daimont.com:8080/api/resource/",
  	currency  : 'COP',
  	iva : [{valor :5, text : "5%"}, {valor :10, text : "10%"}],
    company : {
      company_name : 'Mi Empresa',
      company_address : 'cra 25A#35-56',
      company_phone : '(+57) 301 290 4420',
      company_email : 'company@gmail.com',      
      company_fax : 'company@gmail.com'      
    }
  });
 