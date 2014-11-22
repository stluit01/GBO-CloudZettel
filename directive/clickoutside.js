/**
 * Created by Jens on 22.11.2014.
 */
//angular.module('jens.clickOutside' ,[])
//    .directive('clickOutside', function () {
//        return {
//            restrict: 'A',
//            scope: {
//                clickOutside: '&'
//            },
//            link: function ($scope, elem, attr) {
//                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
//                if (attr.id !== undefined) classList.push(attr.id);
//
//                $document.on('click', function (e) {
//                    var i = 0,
//                        element;
//
//                    if (!e.target) return;
//
//                    for (element = e.target; element; element = element.parentNode) {
//                        var id = element.id;
//                        var classNames = element.className;
//
//                        if (id !== undefined) {
//                            for (i = 0; i < classList.length; i++) {
//                                if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
//                                    return;
//                                }
//                            }
//                        }
//                    }
//
//                    $scope.$eval($scope.clickOutside);
//                });
//            }
//        }
//    });

var app = angular.module('jens.clickOutside', [])

app.directive('clickAnywhereButHere', function($document){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('click', function(e) {
                // this part keeps it from firing the click on the document.
                e.stopPropagation();
            });
            $document.bind('click', function() {
                // magic here.
                scope.$apply(attr.clickAnywhereButHere);
            })
        }
    }
})

app.controller('MyController', function($scope){

})