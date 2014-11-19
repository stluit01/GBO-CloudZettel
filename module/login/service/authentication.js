/**
 * Created by Lukas on 19.11.2014.
 */

angular.module('service.login', [])
    .factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
                console.log("401")
            }
            return $q.reject(rejection);
        }
    };
});