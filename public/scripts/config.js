angular.module('happyHeadApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  var checkAuth = function($http, $location) {
    console.log("resolving");
    return $http.get('/authenticated')
                .catch(function(){
                  $location.path('/login')
                });
  }

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeController as home'
  }).when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController as login'
  }).otherwise({
    templateUrl: 'views/home.html',
    controller: 'HomeController as home'
  });
});
