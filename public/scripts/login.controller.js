angular.module('happyHeadApp')
    .controller('LoginController', LoginController);

function LoginController($http, $location,$scope) {
    console.log('LoginController loaded');
    var login = this;


    //whenever controller is loaded, will check to see if user which/if any user is logged in
    // adminservice.loggedin();

    //
    // //logged in email to display
    login.loggedInEmail = function() {
        $http.get('/info').then(function(response) {

        }, function(error) {
            $location.path('/login');
        });
    };

    // login.loggedInEmail();

    login.login = function() {
        console.log('logging in');
        $http.post('/login', {
            email: login.email,
            password: login.password,
        }).then(function() {
            login.loggedInEmail();
            // adminservice.normalLoggedin();
            // if (adminservice.loggedInDate == undefined || adminservice.loggedInDate == '' || adminservice.loggedInDate == null) {
            //     $location.path('/userUpdate');
            // } else {
            //     $location.path('/resources');
            // }
        }, function(error) {
            console.log('error loggin in', error);
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
$scope.apply();
};


}
