angular.module('happyHeadApp')
    .controller('HomeController', HomeController);

    function HomeController($http,loginService){

      var home = this;
      home.loginService=loginService;
      home.loginService.loggedInEmail();
      

    }
