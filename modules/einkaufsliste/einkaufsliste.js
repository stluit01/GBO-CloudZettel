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
        $scope.isCollapsedHead = true;
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

        $scope.plus = function (name) {
            for (var i = 0, n = $scope.liste.article.length; i < n; i++) {
                if (name === $scope.liste.article[i].name) {
                    $scope.liste.article[i].count++
                }
            }
        }

        $scope.minus = function (name) {
            for (var i = 0, n = $scope.liste.article.length; i < n; i++) {
                if (name === $scope.liste.article[i].name) {
                    $scope.liste.article[i].count--
                }
            }
        }
        $scope.remArticle = function (item) {
            storage.remArticle(article);
        }

        $scope.updateListe = function () {
            $scope.isCollapsedHead = true
            storage.updateListe( $scope.liste);
        }
    });