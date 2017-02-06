angular.module('happyHeadApp')
    .controller('LoginController', LoginController);

function LoginController($http, $location,$scope, loginService) {
    console.log('LoginController loaded');
    var login = this;

login.loginService=loginService;


    //whenever controller is loaded, will check to see if user which/if any user is logged in
login.loginService.loggedInEmail();

    login.login = function() {
        console.log('logging in');
        $http.post('/login', {
            email: login.email,
            password: login.password,
        }).then(function() {

        $location.path('/home');

        }, function(error) {
            console.log('error loggin in', error);
            $location.path('/login');
        });
    };


    login.logout = function() {

    $http.get('/login/logout')
    .then(function(){
    login.loginService.name = "";

      $location.path('/login');
    }, function(error) {
      console.log('error logging out', error);
    });
  };
    //
    login.forgotPasswordEmail = function(email) {
        var body = {
            email: email
        };
        $http.post('/login/mail', body).then(function(response) {
            controller.email = '';
        }, function(error) {
            console.log('error in searching email', error);
        });
    };

login.showForm = false;
login.showRegistration = function(){
  console.log('inside show resgistration');
login.showForm = true;

console.log(login.showForm);
login.hideForm= true;
};

login.registerNewUser = function() {
console.log('Register new user!');

        var data = {
            name: login.registerName,
            email: login.registerEmail,
            password: login.createPassword,
        };

        $http.post('/user/register', data).then(function(response) {
            console.log('successfully added a new user', response);

            // empty form
            login.registerName = '';
            login.registerEmail = '';
            login.createPassword = '';
            login.passwordConfirm = '';

        });

    }; //End of addNewUser

  //menu navigation animation
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
login.openNav= function () {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.height = "100%";
    document.getElementById("mainColor").style.marginLeft = "250px";


}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
login.closeNav= function () {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").style.height = "0";
    document.getElementById("mainColor").style.marginLeft = "0";



}

login.doTheBack = function() {
  window.history.back();
};



}
