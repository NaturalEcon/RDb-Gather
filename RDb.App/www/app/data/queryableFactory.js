(function () {
    "use strict";
    var queryableFactory = function() {
        var factory = this;
        var queryable = {
            data: []
        };
        var constructor = function(list) {
            queryable.data = list;
            queryable.length = list.length;
            return queryable;
        }
        var selectAll = function(item) { return item; }
        var _where = [];
        var _select = selectAll;
        var runQuery = function() {
            queryable.data = queryable.data.reduce(function(data, datum) {
                if (_where.reduce(function(include, _w) { //if all where functions true
                        return include && _w(datum);
                    }, true)) {
                    data.push(_select(datum)); //select item
                }
                return data;
            }, []);
            queryable.length = queryable.data.length;
            _where = [];
            _select = selectAll;
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
        queryable.all = function(condition) {
            if (!condition) {
                throw new Error("You must specify a condition");
            }
            runQuery();
            for (var i in queryable.data) {
                if (!condition(queryable.data[i])) {
                    return false;
                }
            }
            return true;
        }
        queryable.toList = toList;
        queryable.length = queryable.data.length;
        factory.Queryable = constructor;
        return factory;
    }
    angular.module("RDb").factory("queryableFact", queryableFactory);
})();