/**
 * Created by Jens on 10.11.2014.
 */
angular.module('service.storage', [])
    .factory('storage', function () {
        'use strict';

        var collection = [
            {
                titel: 'Lebensmittel',
                id:'01',
                artikel: [{
                    //'092380' ,'092380' ,'092380' ,'092380' ,'092380' ,
                    name: 'Tee', anzahl: '2', status:'check'}, {
                    name: 'Sprudel', anzahl: '5', status:'uncheck'}, {
                    name: 'Bier', anzahl: '10', status:'check'}]
            },
            {
                titel: 'Büro',
                id:'02',
                artikel: [{
                    name: 'Kugelschreiber', anzahl: '5', status:'check'}, {
                    name: 'Papier', anzahl: '200', status:'uncheck'}]
            },
            {
                titel: 'Bücher',
                id:'03',
                artikel: [{
                    name: 'AngularJS', anzahl: '1', status:'uncheck'}, {
                    name: 'PhoneGap', anzahl: '1', status:'uncheck'}]
            },
            {
                titel: 'Kosmetik',
                id:'04',
                artikel: [{
                    name: 'Mascara', anzahl: '1', status:'uncheck'}, {
                    name: 'Wattepads', anzahl: '1', status:'check'}]
            }
        ];

        var getListen = function () {
            if (angular.isArray(collection)) {
                return collection;
            }
            throw new Error('Storage is not readable!');
        };

        var getListeById = function (id,list) {
            if (angular.isArray(collection)) {
                for (var i = 0, n = collection.length; i < n; i++) {
                    if (parseInt(id) === parseInt(collection[i].id)) {
                        angular.copy(collection[i],list);
                    }
                }
            }
            else throw new Error('Storage is not readable!');
        };

        var getCount = function () {
            try {
                return collection.length;
            } catch (e) {
                throw e;
            }
        };

        var addListe = function (item) {
            if (angular.isObject(item) && !angular.isArray(item)) {
                try {
                    collection.push(item);
                    //notification.createMessage(item);
                } catch (e) {
                    throw e;
                }
            } else {
                throw new TypeError('Can not add item - storage item has to be an object.');
            }
        };

        var removeListe = function (index) {
            if (
                angular.isObject(collection[index]) && !angular.isArray(collection[index])
            ) {
                try {
                    //var item = collection[index];
                    collection.splice(index, 1);
                    //notification.deleteMessage(item);
                } catch (e) {
                    throw e;
                }
            } else {
                throw new TypeError('Can not delete item - storage item has to be an object.');
            }
        };

        var removeListeById = function (id) {
            try {
                for (var i = 0, n = collection.length; i < n; i++) {
                    if (parseInt(id) === parseInt(collection[i].id)) {
                        collection.splice(i, 1);
                    }
                }
            } catch (e) {
                throw e;
            }
        };
        // Reveal public API.
        return {
            getListen: getListen,
            getListeById: getListeById,
            getMessageCount: getCount,
            addListe: addListe,
            removeListe: removeListe,
            removeListeById: removeListeById
        };
    });

