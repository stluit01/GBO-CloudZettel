/**
 * Created by Lukas on 19.11.2014.
 */

angular.module('service.login', [])
    .factory('authInterceptor', function ($rootScope, $q, $window, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // handle the case where the user is not authenticated
                    $location.path("/login")
                }
                return $q.reject(rejection);
            }
        };
    });
