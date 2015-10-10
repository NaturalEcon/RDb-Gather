(function () {
    var scanCtrl = function (scanSvc, scanDataSvc, rdbSvc) {
        rdbSvc.UI.Title = "New Scan";
        this.startScan = scanSvc.scan;
        this.data = scanDataSvc;
    }
    angular.module("RDb")
        .controller("scanCtrl", ["scanSvc", "scanDataSvc", "rdbSvc", scanCtrl]);
})();


(function () {
    var listCtrl = function (productDbSvc, initialList, $scope, apiSvc, rdbSvc, productDbSvc) {
        rdbSvc.UI.Title = "Scans";
        var list = this;
        list.scans = initialList;
        productDbSvc.getListPage().then(updateScope);
        list.batch = apiSvc.batchDb;
        list.remove = function (productDto) {
            productDbSvc.remove(productDto).then(function () {
                productDbSvc.getListPage().then(function (list) {
                    this.list.scans = list;
                });
            });
        }
        list.bestAvailableName = function (product) {
            return product.Alias || product.Name || product.Description || product.Upc || "Undefined";
        }
        $scope.$on("$destroy", function () {
            productDbSvc.resetPaging();
        });
    }
    angular.module("RDb").controller("listCtrl", ["productDbSvc", "initialList", "$scope", "apiSvc", "rdbSvc", "productDbSvc", listCtrl]);
})();