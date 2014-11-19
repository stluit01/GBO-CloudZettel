/**
 * Created by Jens on 10.11.2014.
 */
angular.module('service.storage', [])
    .factory('storage', function ($http) {
        'use strict';

        var o = {
            lists: []
        };

        o._baseUrl = '';   //http://localhost:4730/api/termine/

        o.getListen = function () {
            return $http.get(o._baseUrl + '/api/listen').success(function (data) {
                angular.copy(data, o.lists);
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

        // Reveal public API.
        return o;
    });

