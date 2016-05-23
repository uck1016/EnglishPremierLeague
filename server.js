/**
 * Created by chaitanyakrishna on 2/27/2015.
 */

if( !process.env.NODE_CONFIG_DIR || process.env.NODE_CONFIG_DIR == "./config" )
    process.env.NODE_CONFIG_DIR = process.cwd() + "/config";

process.on("uncaughtException", function(err){
    console.error("Error caught and error is "+ err);
    process.exit(1);
})
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var config =  require("config");
var logger = require("./lib/logger");

var applicationLogger = logger.create("EPL");

logger.addInstance(app);

var appConfig = config.get("appConfig");

app.use(bodyParser.json());

app.route("/")
    .all(logRequest);

app.listen(appConfig.port ? appConfig.port : 4545, function (err, res){
    applicationLogger.info("EPL application is up and running on"+ appConfig.host+":"+appConfig.port);
})


function logRequest(req, res, next){
    req.logger.debug("EPL request received at : "+ new Date().getTime());
    next();
}
//Main module responsible for creating the underlying data structures required by the application
//require("./EplBatchRun");

/*setTimeout(function(){
    //bootstrapEPL module is loaded on start of the server as it creates all the necessary collections in mongoDB,
    //which are modeled based on application's access patterns.
    var startEPL = require("./bootstrapEPL");
            //Below statements load all the REST API's defined for the user inter-activity.
            app.use(require("./controllers/static"));
            app.use(require("./controllers/api/teams"));
            app.use(require("./controllers/api/GenerateStandingsTable"));
            app.use(require("./controllers/api/GetUpcomingMatchSchedule"));
            app.use(require("./controllers/api/GetTeamData"));
            app.use(require("./controllers/api/GetPlayerData"));
            app.use(require("./controllers/api/GetTeamBrief"))
            app.use(require("./controllers/api/GetUpcomingMatchSchedule"));
            app.use(require("./controllers/api/GetMatchResults"));
            app.use(require("./controllers/api/GetUpcomingMatchesByTeam"));
            app.use(require("./controllers/api/GetGoalStatsByTeam"));
            app.use(require("./controllers/api/GetStatsByTournament"));

            var server = app.listen(process.env.PORT||4545,function(){
                console.log("server listening on",4545)
                //webSockets.connect(server);
            })
},55000);*/
