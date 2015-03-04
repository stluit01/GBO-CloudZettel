/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('listsCtrl', function ($rootScope, $scope, ngDialog, listsDataService, $location) {
    'use strict';
    $rootScope.color = "material-card";
    $rootScope.$broadcast('bissyStart', [1, 2, 3]);
    listsDataService.getLists().then(function (res) {
        $rootScope.$broadcast('bissyEnd', [1, 2, 3]);
        $scope.lists = res.data;
    });

    $scope.remList = function (id) {
        ngDialog.openConfirm({
            template: 'modules/einkaufsliste/view/confirmDeleteListPopupTmpl.html'
        }).then(function (value) {
            listsDataService.removeList(id).then(function () {
                for (var i = 0; i < $scope.lists.length; i++) {
                    //console.log($scope.lists[i].id +" : "+ id);
                    if ($scope.lists[i].id === id) {
                        $scope.lists.splice(i, 1);
                        break;
                    }
                }
            });
        });
    };

    $scope.edit = function (id) {
        $location.search('id', id);
        $location.path('/addEditList');
    };

    $scope.newList = function () {
        $location.url('/addEditList');
    };
});