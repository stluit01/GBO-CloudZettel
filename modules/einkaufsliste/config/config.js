/**
 * Created by Jens on 10.11.2014.
 */
angular.module('einkaufsliste.config', [
    'service.storage'
])
    .config(function ($routeProvider) {
        'use strict'

        ;

        $routeProvider
            .when('/listen', {
                templateUrl: 'modules/einkaufsliste/view/listen.tpl.html',
                controller: 'listenCtrl',
                index: 'listen',
                access: { requiredLogin: true },
                resolve: {
                    postPromise: ['storage', function (storage) {
                        return storage.getLists();
                    }]
                }
            })
            .when('/editListe', {
                templateUrl: 'modules/einkaufsliste/view/editListe.tpl.html',
                controller: 'editListeCtrl',
                index: 'editListe',
                access: { requiredLogin: true }
            })
    })