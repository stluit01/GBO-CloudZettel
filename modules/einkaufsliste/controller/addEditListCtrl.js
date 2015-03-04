/**
 * Created by Jens on 29.11.2014.
 */
einkaufsliste.controller('addEditListCtrl', function ($rootScope, $scope, ngDialog, $routeParams, $location, listsDataService, PROPERTIES) {
    'use strict';
    $scope.cordova = PROPERTIES.cordova;

    $scope.alert = function (text) {
        alert(text);
    };

    $scope.setRootColor = function (color) {
        $rootScope.color =  color;
    };

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
                template: 'modules/einkaufsliste/view/recognizeSpeechPopupTmpl.html',
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
        $location.url('/lists');
    };

    $scope.remList = function (id) {
        ngDialog.openConfirm({
            template: 'modules/einkaufsliste/view/confirmDeleteListPopupTmpl.html'
        }).then(function (value) {
            listsDataService.removeList(id).then(function () {
                $location.path('/lists');
            });
        });
    };

    $scope.cleanList = function (id) {
        ngDialog.openConfirm({
            template: 'modules/einkaufsliste/view/confirmClearPopupTmpl.html'
        }).then(function (value) {
            $scope.list.article = _.filter($scope.list.article, function(articel){
                return !articel.purchased;
            });
            listsDataService.updateList($scope.list);
        });
    };

    var oldTitle="";
    var oldColor="";
    $scope.saveOldTitle = function(){
        oldTitle = $scope.list.title;
        oldColor = $scope.list.color;
    };

    $scope.cancelChanges = function () {
        if(!editMode){
            $location.path('/lists');
        } else{
            $scope.list.title= oldTitle;
            $scope.list.color= oldColor;
            $rootScope.color= oldColor;
        }
    };

    if (!$routeParams.id) { //new List
        $rootScope.$broadcast('bissyStart', [1, 2, 3]);
        //alert("new List");
        editMode = false;
        $scope.isCollapsedHead = false;

        listsDataService.getNewId().then(function (res) {
            var id = res.data;
            //console.log("id: " + id);
            $rootScope.color = "";
            $scope.list = {
                "id": id,
                "owner": "",
                "shared_with": [],
                "title": "",
                "article": [],
                "color": "material-card"
            };
            $rootScope.$broadcast('bissyEnd', [1, 2, 3]);
        });
    }

    else { //edit List
        $rootScope.$broadcast('bissyStart', [1, 2, 3]);
        //alert("edit list");
        $scope.list = {};
        listsDataService.getList($routeParams.id).then(function (res) {
            $scope.list = res.data;
            $rootScope.color =  $scope.list.color;
            $rootScope.$broadcast('bissyEnd', [1, 2, 3]);
        });
        $scope.isCollapsedHead = true;
    }


    $scope.updateList = function () {
        if (!editMode) { //new List
            //alert("add list");
            //console.log("list: " + $scope.list);
            $rootScope.$broadcast('bissyStart', [1, 2, 3]);
            listsDataService.addList($scope.list).then(function (res) {
                $rootScope.$broadcast('bissyEnd', [1, 2, 3]);
                editMode = true;
                $scope.isCollapsedHead = true;
                $location.search('id', $scope.list.id);
                $location.path('/addEditList');
            })
        }
        else {  //edit List
            //alert("updateList list");
            $rootScope.$broadcast('bissyStart', [1, 2, 3]);
            listsDataService.updateList($scope.list)
                .then(function (res) {
                    $rootScope.color = $scope.list.color;
                    $scope.isCollapsedHead = true;
                    $rootScope.$broadcast('bissyEnd', [1, 2, 3]);
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
            var articleId = res.data;
            if(articleId!=null){ // ACHTUNG Artikel mit id==null dürfen nicht angelegt werden können (Server?)
                //console.log("id: " + id);
                var newArticle = {
                    "id": articleId,
                    "name": $scope.newArtikelName,
                    "count": $scope.newArtikelCount,
                    "purchased": false
                };
                $scope.newArtikelName = "";
                $scope.newArtikelCount = 1;
                listsDataService.addArticleToList($scope.list.id, newArticle).then(function(){
                    $scope.list.article.push(newArticle);
                });
            }
            else{
                alert("newArticleID==null")
            }
        });
    };


    $scope.getknown_articles = function () {
        return listsDataService.getKnownArticles()
            .then(function (res) {
                $scope.known_articles = res.data;
            });
    }
});
