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

        o.getList = function (id) {
            return $http.get(o._baseUrl + '/api/list/' + id)
        };

        o.removeList= function(id){
            return $http.delete(o._baseUrl + '/api/list/' + id);
        };

        o.updateList= function(list) {
            return $http.put(o._baseUrl + '/api/updateList/', list);
        };

        o.addList= function(list){
            return $http.put(o._baseUrl + '/api/addlist/',list);
        };

        o.getNewId= function(){ // gibt neue ID zurück
            return $http.get(o._baseUrl + '/api/newid/');
        };

        // Reveal public API.
        return o;
    });

