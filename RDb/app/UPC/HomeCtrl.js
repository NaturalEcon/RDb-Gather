(function() {
    'use strict';

    var homeCtrl = function ($scope, dataService) {
        var updateList = function() {
            dataService.getUpcList().then(function(result) {
                $scope.UpcList = result;
            });
        }

        $scope.newUpc = {
            upc: "",
            dateTime: dataService.getDate(new Date()),
            userId: 1
        }
        
        $scope.addUpc = function() {
            if ($scope.newUpcForm.$valid) {
                dataService.addUpc($scope.newUpc).then(function(success) {
                    if (success === "true") {
                        $scope.newUpcAdded = true;
                        updateList();
                    } else {
                        $scope.newUpcAdded = false;
                        $scope.upcAddError = true;
                    }
                });
            }
        }
        $scope.newUpcAdded = false;
        $scope.upcAddError = false;
        updateList();
    }

    angular.module('RDb').controller('HomeCtrl', ["$scope", "dataSvc", homeCtrl]);
})();