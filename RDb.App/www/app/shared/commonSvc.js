(function () {
    var commonSvc = function () {
        var isSimulated = function () {
            return typeof cordova === "undefined";
        }
        return {
            isSimulated: isSimulated
        }
    }
    try {
        angular.module("RDb").service("commonSvc", commonSvc);
    } catch (err) {
        throw new Error("Common service error");
    }
})();