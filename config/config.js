/**
 * Created by Jens Schmid on 26.10.2014.
 */
angular.module('cloudEinkaufszettel.config', [
    'ngRoute',
    'einkaufsliste',
    'login',
    'ui.bootstrap',
    'jens.accordion',
    'jens.accordion.tpls',
    'service.login'
]
)
.constant('NAV_ITEMS', [
    {title: 'listen', index: 'listen', hash: '#listen', icon: ''},
    {title: 'editListe', index: 'editListe', hash: '#editListe', icon: ''},
    {title: 'login', index: 'login', hash: '#login', icon: ''},
    {title: 'registrate', index: 'registrate', hash: '#registrate', icon: ''},


])

.config(function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/', {
            redirectTo: '/listen'
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