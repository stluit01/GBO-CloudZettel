/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('listsCtrl', function ($scope, listsDataService, $location) {
    'use strict';

    listsDataService.getLists().then(function (res) {
        $scope.lists = res.data;
    });

    $scope.remListe = function (id) {
        listsDataService.removeList(id).then(function () {
            for(var i=0; i < $scope.lists.length; i++){
                //console.log($scope.lists[i].id +" : "+ id);
                if($scope.lists[i].id === id){
                    $scope.lists.splice(i, 1);
                    break;
                }
            }
        });
    }

    $scope.edit = function (id) {
        $location.search('id', id);
        $location.path('/addEditList');
    }

})