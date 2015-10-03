(function () {
    angular.module("RDb").directive("ngInspector", function() {
        // This expands a <conditional-detail-view> element into an icon with a tooltip and shows a modal with details when clicked.
        return {
            restrict: "E",
            replace: true,
            transclude:true,
            controller: "inspectorController",
            templateUrl: 'views/partials/inspector.html'
        };
    })
    .controller("inspectorController", ["$rootScope", "$scope", "inspectorFactory",
    function($rootScope, $scope, inspectorFactory) {
        $scope.debugger = inspectorFactory;
        $scope.debugger.show = true;
        $scope.debugger.rootObject = $rootScope;
    }]);
    angular.module("RDb").factory("inspectorFactory", function() {
        var self = {};

        self.close = function() {
            var c = this.closed;
            c(!c());
        }
        self._closed = true;
        self.closed = function(newValue) {
            if (newValue !== undefined) {
                self._closed = newValue;
            }
            var cl = !self._closed ? '' : 'closed';
            return cl;
        }
        self._inspectorNavigationHistory = [];
        self.inspectedObject = function(newObjectName) {
            var history = self._inspectorNavigationHistory;
            if (newObjectName !== undefined) {
                history.push(newObjectName);
            }
            var obj = self.rootObject;
            for (var i_prop in history) {
                var prop_name = history[i_prop];
                if (obj.hasOwnProperty(prop_name)) {
                    obj = obj[prop_name];
                }
            }
            return obj;
        }

        self.lastInspectedObject = function() {
            var history = self._inspectorNavigationHistory;
            if (history.length >= 1) {
                return history[history.length - 1];
            }
            return '$rootScope';
        }

        self.inspectorBack = function() {
            self._inspectorNavigationHistory.pop();
        }
        return self;
    });
})();