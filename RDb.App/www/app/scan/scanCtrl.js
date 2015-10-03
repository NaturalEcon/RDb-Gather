(function () {
    var scanCtrl = function ($scope, commonSvc, scanSvc, apiSvc, upcDtoFact, sqlSvc) {
        console.log("Scan ctrl");
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
    var listCtrl = function($scope, sqlSvc) {
        sqlSvc.upc().then(function(result) {
            $scope.list = result;
        });
    }
    angular.module("RDb").controller("listCtrl", ["$scope", "sqlSvc", listCtrl]);
})();