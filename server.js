/**
 * Created by chaitanyakrishna on 2/27/2015.
 */
var express=require("express");
var bodyParser=require("body-parser");
var app=express();
app.use(bodyParser.json());
var webSockets=require("./websockets");
//Main module responsible for creating the underlying data structures required by the application
//require("./EplBatchRun");

setTimeout(function(){
    //bootstrapEPL module is loaded on start of the server as it creates all the necessary collections in mongoDB,
    //which are modeled based on application's access patterns.
    var startEPL=require("./bootstrapEPL");
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

            var server=app.listen(process.env.PORT||4545,function(){
                console.log("server listening on",4545)
                //webSockets.connect(server);
            })
},55000);