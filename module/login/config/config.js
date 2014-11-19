/**
 * Created by Jens on 10.11.2014.
 */
angular.module('login.config', [
    'service.storage'
])
    .config(function ($routeProvider) {
        'use strict'

        ;

        $routeProvider
            .when('/login', {
                templateUrl: 'module/login/view/login.tpl.html',
                controller: 'loginCtrl',
                index: 'login',
                access: { requiredLogin: false }
            })
            .when('/registrate', {
                templateUrl: 'module/login/view/registrate.tpl.html',
                controller: 'registrateCtrl',
                index: 'registrate',
                access: { requiredLogin: false }
            })
    })