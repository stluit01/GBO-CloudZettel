/**
 * Created by Jens on 12.11.2014.
 */
angular.module('login', ['login.config'])

.controller('loginCtrl', function ($scope ) {

    $scope.login = function(email,passwort){
        if (email !== undefined && password !== undefined) {

            UserService.logIn(email, password).success(function(data) {
                AuthenticationService.isLogged = true;
                $window.sessionStorage.token = data.token;
                $location.path("/admin");
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }
    }
    $scope.logout = function logout() {
        if (AuthenticationService.isLogged) {
            AuthenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
        }
    }



})

.controller('registrateCtrl', function ($scope ) {

});