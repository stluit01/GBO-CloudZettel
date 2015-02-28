/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('addEditListCtrl', function ($rootScope, $scope, ngDialog, $routeParams, $location, listsDataService, PROPERTIES) {
    'use strict';
    $scope.cordova = PROPERTIES.cordova;

    $scope.recognizeSpeech = function () {
        var maxMatches = 5;
        var promptString = "Speak now"; // optional
        var language = "de-DE";                     // optional
        window.plugins.speechrecognizer.startRecognize(function (result) {
            ngDialog.openConfirm({
                template: 'modules/einkaufsliste/view/recognizeSpeechPopupTmpl.html',
                controller: 'addEditListCtrl',
                data: result
            }).then(function (value) {
                if (value===-1){
                    $scope.recognizeSpeech();
                }
                else{
                    $scope.newArtikelName = value;
                }
            });
        }, function (errorMessage) {
            alert("Error message: " + errorMessage);
        }, maxMatches, promptString, language);
    };

    $scope.recognizeSpeechBearbeiten = function (index) {
        var maxMatches = 5;
        var promptString = "Speak now"; // optional
        var language = "de-DE";                     // optional
        window.plugins.speechrecognizer.startRecognize(function (result) {
            ngDialog.openConfirm({
                template: 'recognizeSpeechPopupTmpl.html',
                controller: 'addEditListCtrl',
                data: result
            }).then(function (value) {
                if (value===-1){
                    $scope.recognizeSpeechBearbeiten(index);
                }
                else{
                    $scope.list.article[index].name = value;
                }
            });
        }, function (errorMessage) {
            alert("Error message: " + errorMessage);
        }, maxMatches, promptString, language);
    };

    var editMode = true;
    $scope.showNew = false;
    $scope.isCollapsed = true;
    $scope.isCollapsed = true;

    $scope.back = function () {
        $location.path('/lists');
    };

    $scope.remList = function (id) {
        listsDataService.removeList(id).then(function () {
            $location.path('/lists');
        });

    };

    $scope.cleanList = function (id) {
        $scope.list.article = _.filter($scope.list.article, function(articel){
            return !articel.purchased;
        });
        listsDataService.updateList($scope.list);
    };

    $scope.cancelChanges = function () {
        if(!editMode){
            $location.path('/lists');
        } else{
            $scope.isCollapsedHead = true;
        }
    }

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
                    console.log("updateListe ERROR: " + error)
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
    };

    $scope.updateArticle = function (article) {
        //console.log("article: " + article);
        listsDataService.updateArticleInList($scope.list.id, article)
            .then(function (res) {
            }
            , function (error) {
            }
        );
    };

    $scope.remArticle = function (articleId) {
        //alert(articleId);
        listsDataService.removeArticleInList($scope.list.id, articleId)
            .then(function () {
                var i = $scope.list.article.length;
                while (i--) {
                    //console.log(id + " : " +  $scope.list.article[i].id);
                    if (articleId === $scope.list.article[i].id) {
                        $scope.list.article.splice(i, 1);
                        break;
                    }
                }
            }, function (error) {
                alert("remArticle ERROR")
            }
        );
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
            listsDataService.addArticleToList($scope.list.id, newArticle);//TODO then??
        });
    };


    $scope.getknown_articles = function () {
        return listsDataService.getKnownArticles()
            .then(function (res) {
                $scope.known_articles = res.data;
            });
    }
});
