(function () {
    "use strict";
    var queryableFactory = function() {
        var factory = this;
        var queryable = {
            data: []
        };
        var constructor = function(list) {
            queryable.data = list;
            return queryable;
        }
        var selectAll = function(item) { return item; }
        var _where = [];
        var _select = selectAll;
        var runQuery = function() {
            var queryResult = [];
            angular.forEach(queryable.data, function(datum) {
                if (_where.length > 0) {
                    var include = true;

                    for (var w_i in _where) {
                        include = include && _where[w_i](datum);
                    }
                    if (include) {
                        queryResult.push(_select(datum));
                    }
                } else {
                    queryResult.push(_select(datum));
                }
            });
            _where = [];
            _select = selectAll;
            queryable.data = queryResult;
        }
        var toList = function () {
            runQuery();
            return queryable.data;
        }
        queryable.isQueryable = true;
        queryable.where = function (condition) {
            _where.push(condition);
            return queryable;
        }
        queryable.select = function (selector) {
            _select = selector;
            return queryable;
        }
        queryable.any = function (condition) {
            if (!condition) {
                throw new Error("You must specify a condition");
            }
            runQuery();
            for (var i in queryable.data) {
                if (condition(queryable.data[i])) {
                    return true;
                }
            }
            return false;
        }
        queryable.toList = toList;
        factory.Queryable = constructor;
        return factory;
    }
    angular.module("RDb").factory("queryableFact", queryableFactory);
})();