/**
 * Created by Jens Schmid on 26.10.2014.
 */
/**
 * ng-pub-sub
 * @module service.termineDate
 */

angular.module('service.termineData', [])
    .factory('termineData', function ($http) {
        var o = {
            termine: []
        };

        o._baseUrl = 'http://localhost:4730';   //http://localhost:4730/api/termine/

        // Service implementation


        o. getTermin = function (id,termin){
            o.getTerminById(id).then(function (res) {
                angular.copy(res,termin);
            });
        }

        o.getTerminById = function (id) {
            return $http.get(o._baseUrl + '/api/termine/' + id).then(function (res) {
                 return res.data;
            });
        };

        o.getTermine = function () {
            return $http.get(o._baseUrl + '/api/termine').success(function (data) {
                angular.copy(data, o.termine);
            });
        };

        o.add = function (item) {
            item.id = o.getNewId()
            return $http.post(o._baseUrl + '/api/termine', item).then(function () {
                o.termine.push(item);
            });
        };

        o.updateTermin = function (item) {
            return $http.put(o._baseUrl + '/api/termine/' + item.id, item).then(function(){
                var i = o.termine.length;
                while (i--) {
                    if (parseInt(item.id) === o.termine[i].id) {
                        o.termine[i]=item;
                    }
                }
            });
        };

        o.deleteTerminById = function (id) {
            return $http.delete(o._baseUrl + '/api/termine/' + id).then(function () {
                var i = o.termine.length;
                while (i--) {
                    if (parseInt(id) === o.termine[i].id) {
                        o.termine.splice(i, 1);
                    }
                }
            });
        };

        //o.getNewId = function (id) {
        //    return $http.get(
        //        o._baseUrl + '/api/newId'
        //    );
        //};

        o.editStatus = function (termin, status) {
            return o.getTerminById(termin.id).then(function (res) {
                res.status = status;
                o.updateTermin(res).then(function () {
                    termin.status = status;
                });
            });
        };

        o.getNewId = function () {
            var lowest = Number.POSITIVE_INFINITY;
            var highest = Number.NEGATIVE_INFINITY;
            var tmp;

            if (o.termine.length > 0) {

                for (var i = o.termine.length - 1; i >= 0; i--) {
                    tmp = o.termine[i].id;
                    if (tmp < lowest) lowest = tmp;
                    if (tmp > highest) highest = tmp;
                }
                return ++highest;
            }
            else
                return 0;
        }

        // Reveal public API.
        return o;
    })

