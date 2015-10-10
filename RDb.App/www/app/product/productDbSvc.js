(function() {
    var productDbSvc = function(iDbRepoFactory) {
        return iDbRepoFactory.getRepo("Products");
    }
    angular.module("RDb").service("productDbSvc", ["iDbRepoFactory", productDbSvc]);
})();