(function() {
    var listDirective = function(productDbSvc, apiSvc, rdbSvc) {
        return {
            restrict: "EA",
            templateUrl: "/app/scan/list.html",
            link: function(scope, element, attrs) {
                rdbSvc.UI.Title = "Scans";
                //When we navigate to another page, don't go back to the page we were on before
                scope.$on("$destroy", function() {
                    productDbSvc.resetPaging();
                });
                //This is identical to the "controller as" syntax
                scope.list = {
                    scans: productDbSvc.page,
                    batch: apiSvc.batchDb,
                    remove: productDbSvc.remove,
                    bestAvailableName: function(product) {
                        return product.Alias || product.Name || product.Description || product.Upc || "Undefined";
                    }
                };
                scope.page = {
                    number: productDbSvc.pageNumber,
                    prev: productDbSvc.prev,
                    hasPrev: productDbSvc.hasPrev,
                    hasNext: productDbSvc.hasNext,
                    next: productDbSvc.next
                }
                //No need to update after certain method calls, just watch the list
                scope.$watch(function() {
                    return productDbSvc.page;
                }, function(value) {
                    scope.list.scans = value;
                });
            }
        };
    };
    angular.module("RDb").directive("gatherList", ["productDbSvc", "apiSvc", "rdbSvc", listDirective]);

})();