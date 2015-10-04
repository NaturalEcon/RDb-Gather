(function () {
    var sqlSvc = function ($q, rdbSvc, queryableFact) {
        var service = this;
        var q = queryableFact.Queryable;
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
        var sqlValues = function () {
            var args = [];
            for (var i in arguments) {
                if (typeof (arguments[i]) == "string") {
                    args.push("'" + arguments[i] + "'");
                }
                else {
                    args.push("" + arguments[i]);
                }
            }
            return "VALUES (" + args.join(",") + ")";
        }
        service.callbacksBeforeInit = [];
        service.preInit = true;
        service.upcListWithProductInfo = function() {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                var rows = q(results.rows);
                var hasUpc = function(item) {
                    return item.Upc;
                }
                if (rows.length && rows.all(hasUpc)) {
                    deferred.resolve(rows);
                } else {
                    service.upcList().then(function(result) {
                        deferred.resolve(result);
                    });
                }
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            deferUntilInit(function () {
                var queryString = "SELECT * FROM UPC u LEFT OUTER JOIN PRODUCTINFO p ON u.upc = p.upc";
                service.db.transaction(function (tx) {
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
            });
            return deferred.promise;
        }
        service.addUpcAndProductInfo = function (upc, productInfo, datetime) {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                deferred.resolve(results.rows);
            }
            var rejectWithError = function (err) {
                deferred.reject(err);
            }
            if (!datetime) {
                datetime = rdbSvc.getDate(new Date());
            }
            deferUntilInit(function() {
                service.db.transaction(function (tx) {
                    var queryString = "INSERT INTO UPC (upc, datetime) " + sqlValues(upc, datetime);
                    tx.executeSql(queryString, [], resolveResults, rejectWithError);
                });
                if (productInfo.itemname || productInfo.alias || productInfo.description || productInfo.avg_price) {
                    service.db.transaction(function(tx) {
                        var queryString = "INSERT OR REPLACE INTO PRODUCTINFO (upc, itemname, alias, description, avg_price)" +
                            sqlValues(upc, productInfo.itemname, productInfo.alias, productInfo.description, productInfo.avg_price);
                        tx.executeSql(queryString, [], resolveResults, rejectWithError);
                    });
                }
            });
        }
        service.upcList = function(newUpcs) {
            var deferred = $q.defer();
            var resolveResults = function (tx, results) {
                var data = q(results.rows);
                var copyValues = function(item) {
                    return {
                        Upc: item.upc,
                        DateTime: item.datetime
                    }
                }
                var result = data.select(copyValues);
                deferred.resolve(result);
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
            var replaceAndSelect = function () {
                if (newUpcs.isQueryable) {
                    newUpcs = newUpcs.toList();
                }
                var insertNewList = function () {
                    service.db.transaction(function (tx) {
                        var insertions = [];
                        var queryString = "INSERT OR REPLACE INTO UPC (upc, datetime) VALUES (?,?)";
                        angular.forEach(newUpcs, function(upc) {
                            var insertion = $q.defer();
                            insertions.push(insertion);
                            tx.executeSql(queryString, [upc.Upc, upc.DateTime], function() { insertion.resolve(); }, rejectWithError);
                        });
                        $q.all(insertions).then(selectUpcs);
                    });
                }
                var deleteWhereNotInList = function(then) {
                    var sqlList = q(newUpcs).select(function(item) { return item.upc; }).toList();
                    var queryString = "DELETE FROM UPC WHERE upc NOT IN ('" + sqlList.join(',') + "')";
                    service.db.transaction(function(tx) {
                        tx.executeSql(queryString, [], then, rejectWithError);
                    });
                }
                deleteWhereNotInList(insertNewList);
            }

            deferUntilInit(function () {
                if (newUpcs) {
                    replaceAndSelect();
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

    angular.module("RDb").service("sqlSvc", ["$q", "rdbSvc", "queryableFact", sqlSvc]);
})();