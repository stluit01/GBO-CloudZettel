/**
 * Created by Jens on 10.11.2014.
 */
angular.module('login.config', [])
    .config(function ($routeProvider) {
        'use strict'

        ;

        $routeProvider
            .when('/login', {
                templateUrl: 'module/login/view/login.tpl.html',
                controller: '',
                index: 'listen'
            })
    })