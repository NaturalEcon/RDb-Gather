(function () {
    'use strict';

    var rootDirective = function(rdbSvc) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/appRoot.html',
            controller: function () {
                this.rdb = rdbSvc;
            },
            controllerAs: "root"
        }
    }
    angular.module("RDb")
        .directive("appRoot", ["rdbSvc", rootDirective]);
})();