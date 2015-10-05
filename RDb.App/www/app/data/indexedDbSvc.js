(function () {
    var indexedDbSvc = function($q) {
        var service = {};
        service.db = undefined;
        var request = indexedDB.open("MyTestDatabase");
        request.onerror = function(event) {
            alert("Why didn't you allow my web app to use IndexedDB?!");
        };
        request.onsuccess = function(event) {
            service.db = event.target.result;
        };
        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            db.createObjectStore("Products", { keyPath: "Upc" });
            db.createObjectStore("Scans", { keyPath: "Upc" });
        }

        service.dbTransaction = function(store, permission, action) {
            var transaction = service.db.transaction(store, permission);
            var deferred = $q.defer();
            transaction.oncomplete = deferred.resolve;
            transaction.onerror = deferred.error;
            action(transaction.objectStore(store));
            return deferred.promise;
        }

        return service;
    }
    angular.module("RDb").service("indexedDbSvc", ["$q", indexedDbSvc]);
})();

(function() {
    var productDbSvc = function(iDbSvc) {
        var service = {};
        service.addProductInfo = function(productDto) {
            return iDbSvc.dbTransaction(["Products"], "readwrite", function(store) {
                store.add(productDto);
            });
        }

        service.getProductInfo = function(upc) {
            return iDbSvc.dbTransaction(["Products"], "read", function(store) {
                store.get(upc);
            });
        }
        return service;
    }
    angular.module("RDb").service("productDbSvc", ["indexedDbSvc", productDbSvc]);
})();

(function () {
    var scanDbSvc = function (iDbSvc) {
        var service = {};
        service.addScan = function (scanDto) {
            return iDbSvc.dbTransaction(["Scans"], "readwrite", function (store) {
                store.add(scanDto);
            });
        }

        service.getScan = function (upc) {
            return iDbSvc.dbTransaction(["Scans"], "read", function (store) {
                store.get(upc);
            });
        }
        return service;
    }
    angular.module("RDb").service("scanDbSvc", ["indexedDbSvc", scanDbSvc]);
})();