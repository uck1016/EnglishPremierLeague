/**
 * Created by chaitanyakrishna on 2/27/2015.
 */
var express=require("express");
var bodyParser=require("body-parser");
var app=express();
app.use(bodyParser.json());

var startEPL=require("./bootstrapEPL");

app.use(require("./controllers/api/teams"));
app.use(require("./controllers/api/GenerateStandingsTable"));
app.use(require("./controllers/api/GetUpcomingMatchSchedule"));
app.use(require("./controllers/api/GetTeamData"));
app.use(require("./controllers/api/GetPlayerData"));
app.use(require("./controllers/static"));
app.use(require("./controllers/api/GetTeamBrief"))
app.use(require("./controllers/api/GetUpcomingMatchSchedule"));
app.use(require("./controllers/api/GetMatchResults"));
app.use(require("./controllers/api/GetUpcomingMatchesByTeam"));
app.use(require("./controllers/api/GetGoalStatsByTeam"));
app.use(require("./controllers/api/GetStatsByTournament"));

app.listen(4545,function(){
    console.log("server listening on",4545)
})