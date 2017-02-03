angular.module('happyHeadApp')
.service('loginService', function ($http){
  var login = this;
  login.name ='';
  // //logged in email to display
login.loggedInEmail = function() {
  return $http.get('/login/info').then(function(response) {
      login.name = response.data.name;
      return login.name;

    }, function(error) {
      console.log(error);
    });
};

});
// login.loggedInEmail();
