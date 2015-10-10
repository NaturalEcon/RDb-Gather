//Repository factory for indexedDb.
(function() {
    var iDbRepoFactory = function(iDbSvc, $q) {
        this.getRepo = function (store, primaryKey) {
            var createEmptyObject = function (object) {
                //sets properties to empty/falsy
                var eviscerate = function(newObject, prop) {
                    if (!!object[prop].slice) {//strings and arrays
                        newObject[prop] = object[prop].slice(0, 0);
                    }
                    else if(typeof(object[prop]) === "object") {//objects
                        newObject[prop] = createEmptyObject(object[prop]);
                    } else {//numbers and booleans
                        newObject[prop] = undefined;
                    }
                    return newObject;
                }
                return Object.keys(object).reduce(eviscerate, {});
            }

            var repo = {
                page: undefined,
                primaryKey: primaryKey,
                emptyObject: undefined
            };
            if (!store.hasOwnProperty("length")) {
                store = [store];
            }
            var updatePage = function () {
                iDbSvc.thisPage(store, null, true).then(function (value) {
                    repo.page = value.toList();
                });
            }
            repo.update = function(productDto, primaryKey) {
                primaryKey = primaryKey || repo.primaryKey;
                if (primaryKey) {
                    return iDbSvc.dbTransaction(store, "readwrite", function(store) {
                        store.put(productDto);
                    }).then(updatePage);
                }
                //todo: use cursor if no key
            }
            repo.add = function (productDto) {
                return iDbSvc.dbTransaction(store, "readwrite", function (store) {
                    store.add(productDto);
                }).then(updatePage);
            }
            repo.get = function (key) {
                return iDbSvc.dbTransaction(store, "readonly", function (store) {
                    store.get(key);
                });
            }
            repo.remove = function (productDto) {
                return iDbSvc.dbTransaction(store, "readwrite", function (store) {
                    store.delete(productDto.Upc);
                }).then(updatePage);
            }
            repo.create = function () {
                if (!repo.emptyObject) {
                    repo.emptyObject = iDbSvc.getFirst().then(createEmptyObject);
                }
                return $q.when(repo.emptyObject);
            }
            repo.nextPage = function() {
                return iDbSvc.nextPage();
            }
            repo.prevPage = function() {
                return iDbSvc.prevPage();
            }
            repo.resetPaging = function () {
                iDbSvc.resetPaging(store);
            }
            updatePage();
            return repo;
        }
        return this;
    }
    angular.module("RDb").factory("iDbRepoFactory", ["indexedDbSvc", "$q", iDbRepoFactory]);
})();