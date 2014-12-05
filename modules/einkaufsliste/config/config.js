/**
 * Created by Jens on 10.11.2014.
 */
angular.module('einkaufsliste.config', [
    'service.listsDataService',
    'jens.showFocus'
])
    .config(function ($routeProvider) {
        'use strict'
        ;

        $routeProvider
            .when('/lists', {
                templateUrl: 'modules/einkaufsliste/view/lists.tpl.html',
                controller: 'listsCtrl',
                index: 'lists'
            })
            .when('/addEditList', {
                templateUrl: 'modules/einkaufsliste/view/addEditLists.tpl.html',
                controller: 'addEditListCtrl',
                index: 'editList'
            })
    });