(function () {
    'use strict';

    var rootDirective = function(rdbSvc) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/app/appRoot.html',
            controller: function() {
                this.rdb = rdbSvc;
            },
            controllerAs: "root"
        };
    }
    angular.module("RDb").directive("appRoot", ["rdbSvc", rootDirective]);
})();