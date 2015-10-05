(function () {
    var scanSvc = function ($cordova, $q, scanDataSvc) {
        var _scan = $cordova.plugins.barcodeScanner.scan;
        var scan = function () {
            _scan(scanDataSvc.handleScanResult);
        }
        return {
            scan: scan
        };
    }
    angular.module("RDb")
        .service("scanSvc", ["$cordova", "$q", "scanDataSvc", scanSvc]);
})();

(function() {
    var scanDataSvc = function (sqlSvc, apiSvc, upcDtoFact, productFact) {
        var scan = this;
        var remove = function(itemToRemove) {
            var isNotInput = function(item) {
                var fixUndef = function(prop) {
                    return prop === "undefined" ? undefined : prop;
                }
                var unequal = fixUndef(item.Upc) !== fixUndef(itemToRemove.Upc)
                    || fixUndef(item.DateScanned) !== fixUndef(itemToRemove.DateScanned);
                return unequal;
            }
            productFact.scans().then(function (list) {
                var newList = list.where(isNotInput);
                productFact.scans(newList).then(function () {
                    return productFact.scans();
                });
            });
        }

        var updateProductInfo = function(upc) {
            apiSvc.upcInfo(upc).then(function(response) {
                scan.productInfo = response.data;
                return sqlSvc.addUpcAndProductInfo(upc.Upc, scan.productInfo, upc.DateTime);
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
        scan.remove = remove;
    }

    angular.module("RDb").service("scanDataSvc", ["sqlSvc", "apiSvc", "upcDtoFact", "productFact", scanDataSvc]);
})();