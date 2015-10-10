(function () {
    var onAppReady = function (isSimulated) {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["RDb"]);
        });
    }
    document.addEventListener("deviceready", onAppReady, true);
    
})();