(function () {
    var apiSvc = function ($http, upcDtoFact) {
        var rdbApiRootUrl = "http://72.83.43.203";
        var rdbApiBaseUrl = "/api/upc/";
        var rdbApiAddAction = "new";
        var upcDbApiKey = "e75e5078ce345a33cb5da509e274ff13";
        var upcDbApiRootUrl = "http://api.upcdatabase.org/json/";
        var addUpcToRDb = function (upc) {
            var url = rdbApiRootUrl + rdbApiBaseUrl + rdbApiAddAction;
            var upcDto = upcDtoFact.scanToDto(upc);
            return $http.post(url, upcDto);
        }
        var getUpcInfoFromUpcDb = function(upcDto) {
            var url = upcDbApiRootUrl + upcDbApiKey + "/" + upcDto.Upc;
            return $http.get(url);
        }
        return {
            addUpc: addUpcToRDb,
            streamResults: false,
            upcInfo: getUpcInfoFromUpcDb
        }
    }
    angular.module("RDb").service("apiSvc", ["$http", "upcDtoFact", apiSvc]);
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
        return {
            scanToDto: scanToDto
        }
    }
    angular.module("RDb").factory("upcDtoFact", ["rdbSvc", upcDtoFactory]);
})();