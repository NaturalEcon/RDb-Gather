(function () {
    var routerConfig = function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url:'/home',
                templateUrl: 'app/home/home.html'
            })
            .state('about', {
                url:'/about',
                templateUrl: 'app/home/about.html'
            })
            .state('scan', {
                url: '/scan',
                templateUrl: 'app/scan/scan.html'
            })
            .state('list', {
                url: '/list',
                templateUrl: 'app/scan/list.html'
            });
    }
    var exceptionHandling = function() {
        return function(exception, cause) {
            alert(exception.message + "\n" + cause);
        }
    }
    var onAppReady = function (isSimulated) {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["RDb"]);
        });

    }
    var isSimulated = typeof cordova === "undefined";
    
    try {
        angular.module("RDb")
            .config(routerConfig)
            .factory("$exceptionHandler", exceptionHandling);
        angular.module("RDb").factory("$cordova", [
            function() {
                return isSimulated ? undefined : cordova;
            }
        ]);
        if (isSimulated) {
            onAppReady(isSimulated); //this is the browser
        } else {
            document.addEventListener("deviceready", onAppReady, true);
        }
    } catch (err) {
        throw new Error("App start error");
    }
})();