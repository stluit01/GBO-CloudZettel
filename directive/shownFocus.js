/**
 * Created by Jens on 05.12.2014.
 */
angular.module('jens.showFocus', [])
    .directive('showFocus', function ($timeout) {
        return function (scope, element, attrs) {
            scope.$watch(attrs.showFocus,
                function (newValue) {
                    $timeout(function () {
                        newValue && element[0].focus();
                    });
                }, true);
        };
    });
