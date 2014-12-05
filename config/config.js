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
    .constant('NAV_ITEMS', [
        {title: 'lists', index: 'lists', hash: '#lists', icon: ''},
        {title: 'editList', index: 'editList', hash: '#editList', icon: ''},
        {title: 'login', index: 'login', hash: '#login', icon: ''},
        {title: 'registrate', index: 'registrate', hash: '#registrate', icon: ''},
    ])

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
        $httpProvider.interceptors.push('authInterceptor');
    });