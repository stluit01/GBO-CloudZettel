/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('listsCtrl', function ($scope, ngDialog, listsDataService, $location) {
    'use strict';

    $scope.showConfirmDialog = false;
    var idToBeDeleted = -1;

    listsDataService.getLists().then(function (res) {
        $scope.lists = res.data;
    });

    $scope.remList = function (id) {
        ngDialog.openConfirm({
            template: 'modules/einkaufsliste/view/confirmDialogPopupTmpl.html'
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