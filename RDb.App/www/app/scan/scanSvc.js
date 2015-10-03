(function () {
    var scanSvc = function ($cordova, $q) {
        var scanned = [];
        var _scan = $cordova.plugins.barcodeScanner.scan;
        var scan = function () {
            var deferred = $q.defer();
            _scan(function (result) {
                scanned.push(result);
                if (result.cancelled) {
                    deferred.reject(result);
                }
                deferred.resolve(result);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
        var continuousScan = function () {
            _scan(function (result) {
                scanned.push(result);
                if (!result.cancelled) {
                    // ReSharper disable once UseOfImplicitGlobalInFunctionScope
                    _continuousScan();
                }
            });
        }

        var batchScanned = function () {
            //todo: send to server
            scanned = [];
        }
        return {
            batchScanned: batchScanned,
            scan: scan,
            continuousScan: continuousScan
        };
    }
    try {
        angular.module("RDb")
            .service("scanSvc", ["$cordova", "$q", scanSvc]);
    } catch (err) {
        throw new Error("Scan service error");
    }
})();