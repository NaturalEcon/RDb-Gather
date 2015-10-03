(function () {
    'use strict';

    var homeCtrl = function ($scope, $window, $rootScope, sqlSvc) {
        
    }
    try {
        angular.module("RDb")
            .controller("homeCtrl", ["$scope", "$window", "$rootScope", "sqlSvc", homeCtrl]);
    } catch (err) {
        throw new Error("Home controller error");
    }
})();