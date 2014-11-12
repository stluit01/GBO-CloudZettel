/**
 * Created by Jens Schmid on 10.11.2014.
 */

angular.module('cloudEinkaufszettel', ['cloudEinkaufszettel.config'])
    .controller('home', function ($scope, NAV_ITEMS) {
        'use strict';

        $scope.navItems = NAV_ITEMS;

        $scope.$on('$routeChangeSuccess', function (eOpts, currentRoute) {
            if (currentRoute.$$route) {
                $scope.currentRoute = currentRoute.$$route;
            }
        });
    })
