(function() {
    'use strict';

    var menuDirective = function() {
        return {
            restrict: 'EA',
            templateUrl: '/menu/menuTemplate.html'
        };
    }
    angular.module("RDb").directive("gatherMenu", menuDirective);
})();