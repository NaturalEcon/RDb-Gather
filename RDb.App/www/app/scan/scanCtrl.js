(function () {
    var scanCtrl = function (scanSvc, scanDataSvc, rdbSvc) {
        rdbSvc.UI.Title = "New Scan";
        this.startScan = scanSvc.scan;
        this.data = scanDataSvc;
    }
    angular.module("RDb")
        .controller("scanCtrl", ["scanSvc", "scanDataSvc", "rdbSvc", scanCtrl]);
})();

(function() {
    var listCtrl = function(scanDataSvc, apiSvc, rdbSvc, productFact) {
        rdbSvc.UI.Title = "Scans";
        var list = this;
        var updateScope = function (upcList) {
            list.scans = upcList.toList(); 
        }
        productFact.scans().then(updateScope);
        list.batch = apiSvc.batchDb;
        list.remove = scanDataSvc.remove;
        list.bestAvailableName = function(product) {
            return product.Alias || product.Name || product.Description || product.Upc || "Undefined";
        }
    }
    angular.module("RDb").controller("listCtrl", ["scanDataSvc", "apiSvc", "rdbSvc", "productFact", listCtrl]);
})();