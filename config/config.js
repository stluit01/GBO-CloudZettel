/**
 * Created by Jens Schmid on 26.10.2014.
 */
angular.module('cloudEinkaufszettel.config', [
        'ngRoute',
        'ngTouch',
        'einkaufsliste',
        'login',
        'ui.bootstrap',
        'service.login',
        'jens.clickOutside'
    ]
)

    .constant('PROPERTIES',
        {
            serverurl:'http://localhost:4070'
        }
    )

    .config(function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                redirectTo: '/lists'
            })
            .when('/404', {
                templateUrl: 'view/404.tpl.html'
            })
            .otherwise({
                redirectTo: '/404'
            });
    })

    .config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('authInterceptor');
    });