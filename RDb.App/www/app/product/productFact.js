(function() {
    var productFact = function($q, sqlSvc, iDbSvc, apiSvc, queryableFact) {
        var dataToDto = function(scan, lookup) {
            return {
                Upc: scan.Upc,
                Name: lookup.itemname,
                Alias: lookup.alias,
                Description: lookup.description,
                AveragePrice: lookup.avg_price,
                DateScanned: scan.DateTime
            }
        }
        var dtoselector = function (item) {
            return {
                RId: item.RId,
                Upc: item.upc,
                Name: item.itemname,
                Alias: item.alias,
                Description: item.description,
                AveragePrice: item.avg_price,
                DateScanned: item.datetime
            }
        }
        var toDtos = function (results) {
            return results.select(dtoselector);
        }
        return {
            toDto: dataToDto,
            toDtos: toDtos
        }
    }

    angular.module("RDb").factory("productFact", ["$q", "sqlSvc", "indexedDbSvc", "apiSvc", "queryableFact", productFact]);
})();