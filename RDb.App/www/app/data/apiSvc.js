(function () {
    var apiSvc = function ($http, upcDtoFact, sqlSvc) {
        var rdbApiRootUrl = "http://72.83.43.203";
        var rdbApiBaseUrl = "/api/upc/";
        var rdbApiAddAction = "new";
        var rdbApiBatchAction = "batch";
        var upcDbApiKey = "e75e5078ce345a33cb5da509e274ff13";
        var upcDbApiRootUrl = "http://api.upcdatabase.org/json/";
        var addUpcToRDb = function (upc) {
            var url = rdbApiRootUrl + rdbApiBaseUrl + rdbApiAddAction;
            var upcDto = upcDtoFact.scanToDto(upc);
            return $http.post(url, upcDto);
        }
        var batchLocalToRemoteDb = function() {
            var sendToRdb = function(rows) {
                var url = rdbApiRootUrl + rdbApiBaseUrl + rdbApiBatchAction;
                return $http.post(url, { Upcs: upcDtoFact.batchToDtos(rows) });
            }
            return sqlSvc.upcList().then(sendToRdb);
        }
        var getUpcInfoFromUpcDb = function(upcDto) {
            var url = upcDbApiRootUrl + upcDbApiKey + "/" + upcDto.Upc;
            return $http.get(url);
        }
        return {
            addUpc: addUpcToRDb,
            batchDb: batchLocalToRemoteDb,
            streamResults: false,
            upcInfo: getUpcInfoFromUpcDb
        }
    }
    angular.module("RDb").service("apiSvc", ["$http", "upcDtoFact", "sqlSvc", apiSvc]);
})();

(function () {
    var upcDtoFactory = function(rdbSvc) {
        var scanToDto = function(scannedBarcode) {
            var upcDto = {
                Upc: scannedBarcode.text,
                DateTime: rdbSvc.getDate(new Date()),
                UserId: 1
            }
            return upcDto;
        }
        var batchToDtos = function (batch) {
            var batchDtos = [];
            for (var i in batch) {
                batchDtos.push({
                    Upc: batch[i].upc,
                    DateTime: batch[i].datetime,
                    UserId: 1
                });
            }
            return batchDtos;
        }
        return {
            scanToDto: scanToDto,
            batchToDtos: batchToDtos
        }
    }
    angular.module("RDb").factory("upcDtoFact", ["rdbSvc", upcDtoFactory]);
})();