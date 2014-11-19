/**
 * Created by Jens on 12.11.2014.
 */
function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}

angular.module('login', ['login.config'])

.controller('loginCtrl', function ($scope, $http, $window, $location) {
        $scope.user = {email: '', password: ''};
        $scope.isAuthenticated = false;
        $scope.submit = function () {
            //console.log($scope.user);
            $http.post('/login', $scope.user)
                .success(function (data, status, headers, config) {
                    console.log("success");
                    $window.sessionStorage.token = data.token;
                    $scope.isAuthenticated = true;
                    var encodedProfile = data.token.split('.')[1];
                    var profile = JSON.parse(url_base64_decode(encodedProfile));
                    console.log(profile);
                    $location.path("/listen")
                })
                .error(function (data, status, headers, config) {
                    console.log("error");
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    $scope.isAuthenticated = false;
                    // Handle login errors here
                    $scope.error = 'Error: Invalid user or password';
                });
        };

        $scope.logout = function () {
            $scope.isAuthenticated = false;
            delete $window.sessionStorage.token;
        };
})

.controller('registrateCtrl', function ($scope ) {

});