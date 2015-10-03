(function () {
    var rdbSvc = function () {
        var getCsharpDate = function (date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();

            var pad = function (num) {
                return (num < 10 ? "0" + num : "" + num);
            }
            return pad(day) + "/" + pad(month) + "/" + year + " " + pad(hour) + ':' + pad(minute) + ':' + pad(second);
        }
        return {
            getDate: getCsharpDate
        }
    }
    angular.module("RDb").service("rdbSvc", rdbSvc);
})();