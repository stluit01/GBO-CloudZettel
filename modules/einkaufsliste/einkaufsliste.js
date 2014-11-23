/**
 * Created by Jens on 10.11.2014.
 */


angular.module('einkaufsliste', ['einkaufsliste.config'])
    .controller('listenCtrl', function ($scope, storage, $location) {
        'use strict';
        $scope.einkaufslisten = storage.lists;

        $scope.remListe = function (id) {
            storage.removeListe(id);
        }

        $scope.edit = function (id) {
            $location.search('id', id);
            $location.path('/editListe');
        }

    })

    .controller('editListeCtrl', function ($scope, storage, $routeParams, $location) {
        'use strict';

        $scope.showNew = false;
        $scope.isCollapsed = true;
        $scope.isCollapsed = true;

        $scope.back = function () {
            $location.path('/listen');
        }

        $scope.remListe = function (id) {
            storage.removeListe(id);
            $location.path('/listen');
        }

        if (!$routeParams.id){ //new List
            $scope.isCollapsedHead = false;
            var id = storage.addListe();
            $scope.liste = {
                "id": id,
                "owner": "",
                "shared_with": [],
                "title": "neue Liste",
                "article": []
            };
        }

        else { //edit List
            $scope.liste = {};
            storage.getListe($routeParams.id, $scope.liste);
            $scope.isCollapsedHead = true;
        }

        $scope.plus = function (id) {
            //TODO REST!!
            for (var i = 0, n = $scope.liste.article.length; i < n; i++) {
                if (parseInt(id) === $scope.liste.article[i].id) {
                    $scope.liste.article[i].count++
                }
            }
        }

        $scope.minus = function (id) {
            //TODO REST!!
            for (var i = 0, n = $scope.liste.article.length; i < n; i++) {
                if (parseInt(id) === $scope.liste.article[i].id) {
                    $scope.liste.article[i].count--
                }
            }
        }
        $scope.remArticle = function (id) {
            //storage.remArticle(id);
            var i =  $scope.liste.article.length;;
            while (i--) {
                if (parseInt(id) === $scope.liste.article[i].id) {
                    $scope.liste.article.splice(i, 1);
                }
            }
        }

        $scope.updateListe = function () {
            $scope.isCollapsedHead = true
            storage.updateListe( $scope.liste);
        }

        $scope.newArtikelName = "";
        $scope.newArtikelCount = 1;

        $scope.newArtikel = function (name,count) {
            //TODO ID !!!!! //TODO REST
            $scope.showNew = false;
            var newArticle =
            {
                "id" : 500,
                "name" : name,
                "count" : count,
                "purchased" : false
            };
            $scope.newArtikelName = "";
            $scope.newArtikelCount = 1;
            $scope.liste.article.push(newArticle);
        }

        $scope.abortNewArtikel = function (name,count) {
            $scope.showNew = false;
            $scope.newArtikelName = "";
            $scope.newArtikelCount =1;
        }

    });