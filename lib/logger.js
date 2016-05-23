/**
 * Created by uck on 5/8/16.
 */

"use strict"

var bunyan = require("bunyan");
var fs = require("fs");
var path = require("path");
var config = require("config");
var appConfig = config.get("appConfig"),
    uuid = require("node-uuid");

function logger() {

this.path = path.join(fs.existsSync(process.cwd + appConfig.get("logDir")) ? process.cwd + appConfig.get("logDir") : process.cwd()+"/log", "epl.log");
this.fStream = fs.createWriteStream(this.path, {"flag":"a"});
this.stream = process.stdout;
this.level = "debug";

}

logger.prototype.create = function (name){
    this.name = name;

    var logger = bunyan.createLogger(
        {
            "name" : this.name,
            "streams" : [
                {
                    "stream" : this.stream,
                    "level" : this.level,
                    "type" : "stream"
                },
                {
                    "stream" : this.fStream,
                    "level" : this.level,
                    "type" : "file"
                }
            ],
            "serializers" : bunyan.stdSerializers
        }
    )

    logger.info("bunyan initialized");
    this.logger = logger;
    return logger;

}

logger.prototype.addInstance = function (app) {
    var self = this;
    app.use(function(req, res, next){
        var transaction_id = req.headers["X-Transaction-Id"] || uuid.v4();
        req.logger = self.logger.child({"X-Transaction-Id" : transaction_id});
        res.header("X-Transaction-Id", transaction_id);
        next();
    })
}

module.exports = new logger();

