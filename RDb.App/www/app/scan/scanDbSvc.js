
(function () {
    var scanDbSvc = function (iDbRepoFactory) {
        return iDbRepoFactory.getRepo("Products");
    }
    angular.module("RDb").service("scanDbSvc", ["iDbRepoFactory", scanDbSvc]);
})();