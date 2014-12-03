/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('addEditListCtrl', function ($scope, listsDataService, $routeParams, $location) {
    'use strict';

    var editMode = true;
    $scope.showNew = false;
    $scope.isCollapsed = true;
    $scope.isCollapsed = true;

    $scope.back = function () {
        $location.path('/lists');
    };

    $scope.remList = function (id) {
        listsDataService.removeList(id).then(function(){
            $location.path('/lists');
        });

    };

    if (!$routeParams.id) { //new List
        //alert("new List");
        editMode = false;
        $scope.isCollapsedHead = false;
        listsDataService.getNewId().then(function (res) {
            var id = res.data;
            //console.log("id: " + id);

            $scope.list = {
                "id": id,
                "owner": "",
                "shared_with": [],
                "title": "",
                "article": []
            };
        });
    }

    else { //edit List
        //alert("edit list");
        $scope.list = {};
        listsDataService.getList($routeParams.id).then(function (res) {
            $scope.list = res.data;
        });
        $scope.isCollapsedHead = true;
    }


    $scope.updateList = function () {
        if (!editMode) { //new List
            //alert("add list");
            //console.log("list: " + $scope.list);
            listsDataService.addList($scope.list).then(function (res) {
                editMode = true;
                $scope.isCollapsedHead = true;
                $location.search('id', $scope.list.id);
                $location.path('/addEditList');
            })
        }
        else {
            //alert("updateList list");
            listsDataService.updateList($scope.list)
                .then(function (res) {
                    $scope.isCollapsedHead = true;
                }
                , function (error) {
                    console.log("updateListe ERROR: "+ error)
                }
            );
        }
    };

    $scope.newArtikelName = "";
    $scope.newArtikelCount = 1;



    $scope.abortNewArtikel = function (name, count) {
        $scope.showNew = false;
        $scope.newArtikelName = "";
        $scope.newArtikelCount = 1;
    }

    $scope.updateArticle = function (articleId) {
        listsDataService.updateList($scope.list)
            .then(function (res) {
            }
            , function (error) {
            }
        );
    }

    $scope.remArticle = function (id) {
        var i = $scope.list.article.length;
        while (i--) {
            //console.log(id + " : " +  $scope.list.article[i].id);
            if (id === $scope.list.article[i].id) {
                $scope.list.article.splice(i, 1);
                break;
            }
        }
        $scope.updateList();  //TODO: listsDataService.remArticle(id);
    };

    $scope.newArtikel = function () {
        listsDataService.getNewId().then(function (res) {
            $scope.showNew = false;
            var artivleId = res.data;
            //console.log("id: " + id);

            var newArticle = {
                "id": artivleId,
                "name": $scope.newArtikelName,
                "count": $scope.newArtikelCount,
                "purchased": false
            };
            $scope.newArtikelName = "";
            $scope.newArtikelCount = 1;
            $scope.list.article.push(newArticle);
            $scope.updateArticle($scope.list.id);
        });
    };

    $scope.plus = function (id) {
        //alert("plus");
        for (var i = 0, n = $scope.list.article.length; i < n; i++) {
            //console.log(id + " : " +  $scope.list.article[i].id);
            if (id === $scope.list.article[i].id) {
                $scope.list.article[i].count++;
                break;
            }
        }
        $scope.updateArticle(id);
    };

    $scope.minus = function (id) {
        //alert("minus");
        for (var i = 0, n = $scope.list.article.length; i < n; i++) {
            //console.log(id + " : " +  $scope.list.article[i].id);
            if (id === $scope.list.article[i].id) {
                $scope.list.article[i].count--;
                break;
            }
        }
        $scope.updateArticle(id);
    };

    $scope.known_articles=  [ //TODO REST !!
        "Tee",
        "Wurst",
        "Sahne 100ml",
        "Axt",
        "Hammer",
        "Nägel"
    ]
});
