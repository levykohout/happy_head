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
  }).when('/docInfo', {
    templateUrl: 'views/docInfo.html',
    controller: 'DocInfoController as doc'
  }).when('/faq', {
    templateUrl: 'views/faq.html',
    controller: 'FaqController as faq'
  }).when('/messages', {
    templateUrl: 'views/messages.html',
    controller: 'MessagesController as message'
  }).when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'ProfileController as profile'
  }).when('/symptoms', {
    templateUrl: 'views/symptoms.html',
    controller: 'SymptomsController as symptom'
  }).otherwise({
    templateUrl: 'views/home.html',
    controller: 'HomeController as home'
  });
});
