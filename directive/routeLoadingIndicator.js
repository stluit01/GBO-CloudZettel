/**
 * Created by Jens on 03.03.2015.
 */
angular.module('jens.routeLoadingIndicator', [])
    .directive('routeLoadingIndicator', function ($rootScope) {
        return {
            restrict: 'E',
            template:   "<div ng-show='isRouteLoading||bissy' class='ngdialog-overlay'>" + // Achutung css von ng-Dialog verwendet
                            "<div class='spinner'>" +
                                "<wave-spinner></wave-spinner>" + // auchtung css von wave-spinner angepasst (mobile first=
                            "</div>" +
                        "</div>",
            replace: true,
            link: function (scope, elem, attrs) {
                scope.isRouteLoading = false;
                scope.bissy = false;

                $rootScope.$on('$routeChangeStart', function () {
                    //console.log("$routeChangeStart");
                    scope.isRouteLoading = true;
                });

                $rootScope.$on('$routeChangeSuccess', function () {
                    //console.log("$routeChangeSuccess");
                    scope.isRouteLoading = false;
                });

                $rootScope.$on('bissyStart', function () {
                    //console.log("bissyStart");
                    scope.bissy = true;
                });


                $rootScope.$on('bissyEnd', function () {
                    //console.log("bissyEnd");
                    scope.bissy = false;
                });
            }
        };
    });