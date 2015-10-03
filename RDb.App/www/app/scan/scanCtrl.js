(function () {
    var scanCtrl = function ($scope, commonSvc, scanSvc, apiSvc, upcDtoFact, sqlSvc) {
        var initialized = false;
        var updateProductInfo = function(upc) {
            apiSvc.upcInfo(upc).then(function(response) {
                $scope.productInfo = response.data;
                sqlSvc.addUpcAndProductInfo($scope.upc.Upc, $scope.productInfo, $scope.upc.DateTime);
            });
        }
        var scanSuccessful = function(response) {
            $scope.msg = response.data? "accepted" : "rejected";
            if (!initialized) {
                initialized = true;
                $scope.$watch("upc", updateProductInfo);
            }
        }
        var scanResult = function(result) {
            $scope.upc = upcDtoFact.scanToDto(result);
            $scope.requestSent = true;
            
            if (apiSvc.streamResults) {
                apiSvc.addUpc(result).then(scanSuccessful, function(response) {
                    $scope.msg = "rejected";
                });
            }
        }
        $scope.startScan = function() {
            if (!commonSvc.isSimulated()) {
                scanSvc.scan().then(scanResult);
            }
        }
    }
    angular.module("RDb")
        .controller("scanCtrl", ["$scope", "commonSvc", "scanSvc", "apiSvc", "upcDtoFact", "sqlSvc", scanCtrl]);
})();

(function() {
    var listCtrl = function($scope, sqlSvc, apiSvc) {
        $scope.Title = "Scans";
        var updateScope = function (upcList) {
            $scope.upcList = upcList;
            $scope.scans = upcList.toList(); 
        }
        sqlSvc.upcList().then(updateScope);
        $scope.batch = apiSvc.batchDb;
        $scope.remove = function(scan) {
            var isNotInput = function (item) {
                var fixUndef = function(prop) {
                    return prop === "undefined" ? undefined : prop;
                }
                return fixUndef(item.Upc) !== fixUndef(scan.Upc)
                    && fixUndef(item.DateTime) !== fixUndef(scan.DateTime);
            }
            sqlSvc.upcList($scope.upcList.where(isNotInput)).then(updateScope);
        }
    }
    angular.module("RDb").controller("listCtrl", ["$scope", "sqlSvc", "apiSvc", listCtrl]);
})();