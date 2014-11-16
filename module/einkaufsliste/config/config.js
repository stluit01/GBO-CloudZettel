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
                templateUrl: 'module/einkaufsliste/view/listen.tpl.html',
                controller: 'listenCtrl',
                index: 'listen'

            })
            .when('/editListe', {
                templateUrl: 'module/einkaufsliste/view/editListe.tpl.html',
                controller: 'editListeCtrl',
                index: 'editListe'

            })
    })