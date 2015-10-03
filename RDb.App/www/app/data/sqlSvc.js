(function () {
    var sqlSvc = function ($q, rdbSvc) {
        var service = this;
        var createDb = function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS UPC (id integer primary key, upc text, datetime text)");
            tx.executeSql("CREATE TABLE IF NOT EXISTS SCAN (id integer primary key, data text, barcodetype text)");
            tx.executeSql("CREATE TABLE IF NOT EXISTS PRODUCTINFO (upc text primary key, itemname text, alias text, description text, avg_price real)");
        }
        var finishCallsAfterInit = function () {
            service.preInit = false;
            for (var i in service.callbacksBeforeInit) {
                service.db.transaction(service.callbacksBeforeInit[i]);
            }
        }
        var deferUntilInit = function(fn) {
            if (service.preInit) {
                service.callbacksBeforeInit.push(fn);
            } else {
                fn();
            }
            if (!service.db) {
                service.db = openDatabase("rdb", "0.1", "RDb", 1000000);
                var x = service.db.transaction(createDb, function (err) { alert(err.message); });
                finishCallsAfterInit();
            }
        }
        
        service.callbacksBeforeInit = [];
        service.preInit = true;
        service.upcList = function() {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                deferred.resolve(results);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            deferUntilInit(function() {
                service.db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM UPC", [], resolveResults, rejectWithError);
                });
            });
            return deferred.promise;
        }
        service.upcListWithProductInfo = function() {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                deferred.resolve(results);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            deferUntilInit(function () {
                var queryString = "SELECT * FROM UPC u JOIN PRODUCTINFO p ON p.upc = u.upc";
                service.db.transaction(function (tx) {
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
            });
            return deferred.promise;
        }

        var sqlValues = function () {
            var args = [];
            for (var i in arguments) {
                if (typeof(arguments[i]) == "string") {
                    args.push("'" + arguments[i] + "'");
                }
                else {
                    args.push("" + arguments[i]);
                }
            }
            return "VALUES (" + args.join(",") + ")";
        }
        service.addUpcAndProductInfo = function (upc, productInfo, datetime) {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                deferred.resolve(results);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            if (!datetime) {
                datetime = rdbSvc.getDate(new Date());
            }
            deferUntilInit(function() {
                service.db.transaction(function (tx) {
                    var queryString = "INSERT INTO UPC (upc, datetime)" + sqlValues(upc, datetime);
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
                service.db.transaction(function (tx) {
                    var queryString = "INSERT OR REPLACE INTO PRODUCTINFO (upc, itemname, alias, description, avg_price)" +
                        sqlValues(upc, productInfo.itemname, productInfo.alias, productInfo.description, productInfo.avg_price);
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });

            });
        }
        service.upc = function(newUpc) {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                var data = JSON.parse(JSON.stringify(results.rows));
                deferred.resolve(data);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            var selectUpcs = function() {
                var queryString = "SELECT * FROM UPC";
                service.db.transaction(function (tx) {
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
            }
            var insertOrReplaceAndSelect = function(newUpc) {
                service.db.transaction(function (tx) {
                    var queryString = "INSERT OR REPLACE UPC (upc, datetime) VALUES ('" + upc + "',"
                        + "'" + datetime + "')";
                    tx.executeSql(queryString, [], selectUpcs, rejectWithError);
                });
            }

            deferUntilInit(function () {
                if (newUpc) {
                    insertOrReplaceAndSelect(newUpc);
                } else {
                    selectUpcs();
                }
            });
            return deferred.promise;
        }
        service.addUpc = function(upc, datetime) {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                deferred.resolve(results);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            if (!datetime) {
                datetime = rdbSvc.getDate(new Date());
            }
            deferUntilInit(function() {
                service.db.transaction(function(tx) {
                    var queryString = "INSERT INTO UPC (upc, datetime) VALUES ('" + upc + "',"
                        + "'" + datetime + "')";
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
            });
            return deferred.promise;
        }
        return service;
    }

    angular.module("RDb").service("sqlSvc", ["$q", "rdbSvc", sqlSvc]);
})();