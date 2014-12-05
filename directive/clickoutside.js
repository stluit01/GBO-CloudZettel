/**
 * Created by Jens on 22.11.2014.
 */
var app = angular.module('jens.clickOutside', []);

app.directive('clickAnywhereButHere', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
            elem.bind('click', function (e) {
                // this part keeps it from firing the click on the document.
                e.stopPropagation();
            });
            $document.bind('click', function () {
                // magic here.
                scope.$apply(attr.clickAnywhereButHere);
            })
        }
    }
});

app.controller('MyController', function ($scope) {

});