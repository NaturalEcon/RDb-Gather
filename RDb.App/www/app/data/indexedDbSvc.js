(function () {
    var indexedDbSvc = function($q, queryableFact) {
        var service = {};
        var q = queryableFact.Queryable;
        var defaultPageSize = 5;
        service.db = undefined;
        service.init = function() {
            var request = indexedDB.open("MyTestDatabase");
            request.onerror = function(event) {
                throw new Error("This environment does not support IndexedDb");
            };
            request.onsuccess = function(event) {
                service.db = event.target.result;
            };
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                db.createObjectStore("Products", { keyPath: "RId", autoincrement: true })
                  .createIndex("upc", "Upc");
                db.createObjectStore("Scans", { keyPath: "SId", autoincrement: true })
                  .createIndex("date", "DateScanned", { unique: true });
            }
        }
        service.objectStoreExists = function(store) {
            return service.db.objectStoreNames.indexOf(store) !== -1
        }
        service.dbTransaction = function(store, permission, action) {
            var transaction = service.db.transaction(store, permission);
            var deferred = $q.defer();
            transaction.oncomplete = deferred.resolve;
            transaction.onerror = deferred.error;
            action(transaction.objectStore(store));
            return deferred.promise;
        }
        var position = {};
        var keys = {};
        service.resetPaging = function (store) {
            keys[store] = {
                first: undefined,
                last: undefined
            };
        }
        service.getFirst = function (store) {
            var deferred = $q.defer();
            var getFirst = function (cursorEvent) {
                var cursor = cursorEvent.target.result;
                if (cursor) {
                    deferred.resolve(cursor.value);
                }
            }
            var transaction = service.db.transaction([store], "readonly");
            var objectStore = transaction.objectStore(store);
            var cursor = objectStore.openCursor(rangeStart);
            cursor.onsuccess = getFirst();
            return deferred.promise;
        }
        var pageFunction = function(store, pageSize, direction) {
            pageSize = pageSize || defaultPageSize;
            var deferred = $q.defer();
            var counter = pageSize;
            var page = [];
            if (!keys[store]) {
                keys[store] = {};
            }
            //query function
            var getPage = function (cursorEvent) {
                var cursor = cursorEvent.target.result;
                if (cursor && (counter < 0 || counter--)) {
                    if (direction) {
                        if (counter == pageSize - 1) {
                            keys[store][direction == "prev" ? first : last] = cursor.key;
                        }
                        keys[store][direction == "prev" ? last : first] = cursor.key;
                    }
                    page.push(cursor.value);
                    cursor.continue();
                }
            }
            var transaction = service.db.transaction([store], "readonly");
            var objectStore = transaction.objectStore(store);
            var rangeStart = null;
            if (direction) {
                var bound = direction == "prev" ? upperBound : lowerBound;
                rangeStart = keys[store].first
                ? IDBKeyRange.bound(keys[store].first)
                : null;
            }
            var cursor = objectStore.openCursor(rangeStart, direction);
            cursor.onsuccess = getPage;
            transaction.oncomplete = function () { deferred.resolve(q(page)); }
            return deferred.promise;
        }
        var pageAvailability = function(bound) {
            var deferred = $q.defer();
            var transaction = service.db.transaction([store], "readonly");
            var objectStore = transaction.objectStore(store);
            var countRequest = objectStore.count();
            cursor.onsuccess = function (response) {
                deferred.resolve(response > 0);
            }
            return deferred.promise;
        }
        service.prevPage = function (store, pageSize) {
            return pageFunction(store, pageSize, "prev");
        }
        service.hasPrev = function (store) {
            return pageAvailability(IDBKeyRange.upperBound(keys[store].last));
        }
        service.hasNext = function() {
            return pageAvailability(IDBKeyRange.lowerBound(keys[store].first));
        }
        service.nextPage = function(store, pageSize) {
            return pageFunction(store, pageSize, "next");
        }
        service.thisPage = function(store, pageSize) {
            return pageFunction(store, pageSize);
        }
        return service;
    }
    angular.module("RDb").service("indexedDbSvc", ["$q", "queryableFact", indexedDbSvc]);
})();