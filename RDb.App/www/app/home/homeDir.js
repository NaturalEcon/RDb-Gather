(function() {
    'use strict';
    var homeDirective = function(rdbSvc) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/app/home/home.html',
            link: function() {
                rdbSvc.UI.Title = "Gather Home";
            }
        }
    }
    angular.module("RDb").directive("gatherHome", ["rdbSvc", homeDirective]);
})();