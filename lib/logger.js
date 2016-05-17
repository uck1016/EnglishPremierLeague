/**
 * Created by uck on 5/8/16.
 */
var bunyan = require("bunyan");
var fs = require("fs");
var path = require("path");

function logger() {
this.path = path.join(__dirname, "oap.log");
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

    return logger;

}

var myLogger = new logger();
var log = myLogger.create("EPL");
log.info("HI"+ myLogger.path);

