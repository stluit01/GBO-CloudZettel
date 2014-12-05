/**
 * Created by Jens on 10.11.2014.
 */
angular.module('service.listsDataService', [])
    .factory('listsDataService', function ($http) {
        'use strict';

        var o = {};
        o._baseUrl = '';

        o.getLists = function () {
            return $http.get(o._baseUrl + '/api/lists');
        };

        o.removeList = function (id) {
            return $http.delete(o._baseUrl + '/api/list/' + id);
        };

        o.getNewId = function () { // gibt neue ID zurück
            return $http.get(o._baseUrl + '/newid/');
        };

        o.addList = function (list) {
            return $http.put(o._baseUrl + '/api/addlist/', list);
        };

        o.addArticleToList = function (listId, article) {
            return $http.put(o._baseUrl + '/api/addarticletolist/' + listId, article);
        };

        o.getList = function (id) {
            return $http.get(o._baseUrl + '/api/list/' + id)
        };

        o.updateList = function (list) {
            return $http.put(o._baseUrl + '/api/updateList/', list);
        };

        o.removeArticleInList = function (listId, articleId) {
            return $http.delete(o._baseUrl + '/api/delArticleInList/' + listId + "-" + articleId);
        };

        o.updateArticleInList = function (listId, article) {
            return $http.put(o._baseUrl + '/api/updateArticleInList/' + listId, article);
        };

        o.getKnownArticles = function () {
            return $http.get(o._baseUrl + '/api/getKnownArticles/');
        };

        o.addUser = function (user) {
            return $http.put(o._baseUrl + '/addUser', user);
        };

        // Reveal public API.
        return o;
    });

