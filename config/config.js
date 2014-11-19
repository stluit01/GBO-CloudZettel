/**
 * Created by Jens Schmid on 26.10.2014.
 */
angular.module('cloudEinkaufszettel.config', [
    'ngRoute',
    'einkaufsliste',
    'login',
    'ui.bootstrap',
    'jens.accordion',
    'jens.accordion.tpls'
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
        .otherwise({
            redirectTo: '/404'
        });
})

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/login");
        }
    });
});