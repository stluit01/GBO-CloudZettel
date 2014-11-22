/**
 * Created by Jens on 10.11.2014.
 */
angular.module('service.storage', [])
    .factory('storage', function ($http) {
        'use strict';

        var id = "500"

        var o = {
            lists: []
        };

        o._baseUrl = '';

        o.getListen = function () {
            return $http.get(o._baseUrl + '/api/listen').success(function (data) {
                angular.copy(data, o.lists);
            });
        };

        o. getListe = function (id,liste){
            o.getListeById(id).then(function (res) {
                angular.copy(res,liste);
            });
        };

        o.getListeById = function (id) {
            return $http.get(o._baseUrl + '/api/liste/' + id).then(function (res) {
                return res.data;
            });
        };

        o.removeListe= function(id){
            return $http.delete(o._baseUrl + '/api/liste/' + id).then(function () {
                var i = o.lists.length;
                while (i--) {
                    if (parseInt(id) === o.lists[i].id) {
                        o.lists.splice(i, 1);
                    }
                }
            });
        };

        o.updateListe= function(liste){ //TODO REST
            //return $http.post(o._baseUrl + '/api/liste/' + id).then(function () {
                var i = o.lists.length;
                while (i--) {
                    if (parseInt(liste.id) === o.lists[i].id) {
                        o.lists[i]=liste;
                    }
                }
            //});
        }

        o.addListe= function(){ // gibt neue ID zurück //TODO REST
            id++;
            var item ={
                "id": id
            };
            o.lists.push(item);
            return id;
        }

        // Reveal public API.
        return o;
    });

