"use strict";
var Response = (function () {
    function Response(ret, time, result, msg) {
        this.return_ = ret;
        this.time = time;
        this.result = result;
        this.msg = msg;
    }
    Response.prototype.getResponse = function () {
        return this;
    };
    return Response;
}());
exports.Response = Response;
//# sourceMappingURL=result.js.map