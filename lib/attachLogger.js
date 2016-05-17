/**
 * Created by uck on 5/16/16.
 */
var uuid = require("node-uuid");

module.exports = function (app) {
    app.use(function(req,res,next){
        var transaction_id = req.headers["X-Transaction-Id"] || uuid.v4();
        req.logger = logger.child({"X-Transaction-Id" : transaction_id});
        res.headers["X-Transaction-Id"] = transaction_id;
        next();
    })
}