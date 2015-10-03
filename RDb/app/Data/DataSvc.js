(function() {
    'use strict';

    var dataService = function ($q, $http) {

        var get = function(route) {
            var deferred = $q.defer();
            $http.get(route).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        var post = function (route, data) {
            var deferred = $q.defer();
            $http.post(route, data).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        var getUpcList = function() {
            return get("/api/upc/list");
        }

        var addUpc = function(upc) {
            return post("/api/upc/new", upc);
        }

        var getCsharpDate = function(date) {
            var day = date.getDay();
            var month = date.getMonth();
            var year = date.getFullYear();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();

            var pad = function(num) {
                return (num < 10 ? "0" + num : "" + num);
            }

            // After this construct a string with the above results as below
            return pad(day) + "/" + pad(month) + "/" + year + " " + pad(hour) + ':' + pad(minute) + ':' + pad(second);
        }

        return {
            getUpcList: getUpcList,
            addUpc: addUpc,
            getDate: getCsharpDate
        }
    }

    angular.module("RDb").service("dataSvc", ["$q", "$http", dataService]);
})();