(function() {
    'use strict';

    var routeConfig = function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                template: '<gather-home></gather-home>'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/home/about.html'
            })
            .state('scan', {
                url: '/scan',
                template: '<gather-scan></gather-scan>'
            })
            .state('list', {
                url: '/list',
                template: '<gather-list></gather-list>'
            })
            .state('menu', {
                url: '/menu',
                template: '<gather-menu></gather-menu>'
            });
    }
    angular.module("RDb").config(["$stateProvider", "$urlRouterProvider", routeConfig]);

    var initDb = function(iDbSvc) {
        iDbSvc.init();
    }
    angular.module("RDb").run(["indexedDbSvc", initDb]);
})();