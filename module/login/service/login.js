/**
 * Created by Lukas on 19.11.2014.
 */

angular.module('service.login', [])
appServices.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }

    return auth;
});
appServices.factory('UserService', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post(options.api.base_url + '/login', {username: username, password: password});
        },

        logOut: function() {

        }
    }
});