(function () {
    var scanDirective = function (scanSvc, scanDataSvc, rdbSvc) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/scan/scan.html',
            controller: function() {
                rdbSvc.UI.Title = "New Scan";
                this.startScan = scanSvc.scan;
                this.data = scanDataSvc;
            },
            controllerAs: "scan"
        }
    }
    angular.module("RDb")
        .directive("gatherScan", ["scanSvc", "scanDataSvc", "rdbSvc", scanDirective]);
})();
