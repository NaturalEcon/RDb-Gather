(function () {
    var scanSvc = function (rdbSvc, $q, scanDataSvc) {
        var _scan = rdbSvc.$cordova.plugins.barcodeScanner.scan;
        var scan = function () {
            _scan(scanDataSvc.handleScanResult);
        }
        return {
            scan: scan
        };
    }
    angular.module("RDb")
        .service("scanSvc", ["rdbSvc", "$q", "scanDataSvc", scanSvc]);
})();

(function() {
    var scanDataSvc = function ($q, apiSvc, upcDtoFact, productFact, productDbSvc, scanDbSvc) {
        var scan = this;

        var updateProductInfo = function(upc) {
            apiSvc.upcInfo(upc).then(function(response) {
                scan.productInfo = response.data;
                var productInfo = productFact.toDto(upc, scan.productInfo);
                return $q.all([productDbSvc.add(productInfo), scanDbSvc.add(upc)]);
            });
        }
        var scanSuccessful = function(response) {
            scan.msg = response.data? "accepted" : "rejected";
        }
        var handleScanResult = function(result) {
            scan.upc = upcDtoFact.scanToDto(result);
            
            if (apiSvc.streamResults) {
                apiSvc.addUpc(scan.upc).then(scanSuccessful, function(response) {
                    scan.msg = "rejected";
                });
            }
            return updateProductInfo(scan.upc);
        }

        scan.handleScanResult = handleScanResult;
    }

    angular.module("RDb").service("scanDataSvc", ["$q", "apiSvc", "upcDtoFact", "productFact", "productDbSvc", "scanDbSvc", scanDataSvc]);
})();