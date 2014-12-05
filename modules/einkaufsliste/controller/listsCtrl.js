/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('listsCtrl', function ($scope, listsDataService, $location) {
    'use strict';

    $scope.showConfirmDialog = false;
    var idToBeDeleted = -1;

    listsDataService.getLists().then(function (res) {
        $scope.lists = res.data;
    });

    $scope.remListe = function (id) {
        idToBeDeleted = id;
        $scope.showConfirmDialog = true;
    };

    $scope.deleteListConfirmed = function () {
        if (idToBeDeleted > 0) {
            listsDataService.removeList(idToBeDeleted).then(function () {
                for (var i = 0; i < $scope.lists.length; i++) {
                    //console.log($scope.lists[i].id +" : "+ id);
                    if ($scope.lists[i].id === idToBeDeleted) {
                        $scope.lists.splice(i, 1);
                        break;
                    }
                }
                idToBeDeleted = -1;
            });
        }
        $scope.showConfirmDialog = false;
    };

    $scope.deleteListDeclined = function () {
        idToBeDeleted = -1;
        $scope.showConfirmDialog = false;
    };

    $scope.edit = function (id) {
        $location.search('id', id);
        $location.path('/addEditList');
    };

});