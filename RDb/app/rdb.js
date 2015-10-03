(function() {
    'use strict';
    var rdbConfig = function($stateProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/views/index'

            })
            .state('otherwise', {
                url: '*path',
                templateUrl: '/views/404',
                controller: 'Error404Ctrl'
            });
        $locationProvider.html5Mode(true);
    };
    angular.module('RDb', ['ui.router']);
    angular.module('RDb')
        .config(['$stateProvider', '$locationProvider', rdbConfig]);
})();