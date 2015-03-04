/**
 * Created by Jens Schmid on 10.11.2014.
 */

//token decodieren um z.b. username zu erhalten
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


angular.module('cloudEinkaufszettel', ['cloudEinkaufszettel.config'])
    .controller('home', function ($scope, $location) {
        'use strict';

        $scope.$on('$routeChangeSuccess', function (eOpts, currentRoute) {
            if (currentRoute.$$route) {
                $scope.currentRoute = currentRoute.$$route;
            }
        });
    })

    .controller('NavigationCtrl', function ($scope, $window, $location) { //anzeige navbar
        $scope.logout = function () {
            //alert("logout")
            delete  $window.localStorage.token;
            $location.path("/login");

        };

        $scope.isLogin = false;
        $scope.$on('$routeChangeSuccess', function (eOpts, currentRoute) {
            if (currentRoute.$$route.originalPath != "/registrate"
                && currentRoute.$$route.originalPath != "/login"
                && $window.localStorage.token) {
                //console.log("else");
                $scope.isLogin = true;
                //console.log( $scope.isLogin);
                $scope.user = JSON.parse(url_base64_decode($window.localStorage.token.split('.')[1])).email;
                return;
            }
            $scope.isLogin = false;
        });
    });
