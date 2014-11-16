/**
 * Created by Jens on 10.11.2014.
 */


angular.module('einkaufsliste', ['einkaufsliste.config'])
    .controller('listenCtrl', function ($scope, storage, $location) {
        'use strict';
        $scope.einkaufslisten = storage.getListen();


        $scope.remListe = function (item) {
            storage.removeListe(item);
        }

        $scope.edit = function (id) {
            $location.search('id',id);
            $location.path('/editListe');
        }

    })

    .controller('editListeCtrl', function ($scope, storage, $routeParams ,$location) {
        'use strict';

        $scope.isCollapsed = true;
        $scope.isCollapsedHead = true;

        $scope.removeListeById = function () {
            storage.removeListeById($routeParams.id);
            $location.path('/listen');
        }

        $scope.liste={};
        storage.getListeById($routeParams.id, $scope.liste);


        $scope.plus = function (name) {

            for (var i = 0, n = $scope.liste.artikel.length; i < n; i++) {
                if (name ===$scope.liste.artikel[i].name) {
                    $scope.liste.artikel[i].anzahl++
                }
            }
        }

        $scope.minus = function (name) {
            for (var i = 0, n = $scope.liste.artikel.length; i < n; i++) {
                if (name ===$scope.liste.artikel[i].name) {
                    $scope.liste.artikel[i].anzahl--
                }
            }
        }
        $scope.remArtikel = function (item) {
            storage.remArtikel(name);
        }

    });