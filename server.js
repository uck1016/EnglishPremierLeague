/**
 * Created by chaitanyakrishna on 2/27/2015.
 */
var express=require("express");
var bodyParser=require("body-parser");
var app=express();
app.use(bodyParser.json());
var eplDriver=require("./EPLDriver");
var EplKeySet;
var EplDataSet;
var EplDriver=new eplDriver();
EplDriver.Test();
EplDriver.GetDataFromAPI(function(eplDataSet){
    EplDataSet=eplDataSet;
    //console.log(EplDataSet.length);
    EplDriver.getEplKeySet(function(eplKeySet){
        EplKeySet=eplKeySet;
        EplDriver.FilterEplDataSet(EplDataSet,EplKeySet,function(result){
            EplDataSet=result;
            //console.log(Object.keys(EplDataSet[0]).length);
            EplDriver.AlterEplDataSet(EplDataSet,function(finalResult){
                EplDataSet=finalResult;
                EplDriver.StoreToMongo(EplDataSet);
            });
        })
    });
});
setTimeout(function(){

var startEPL=require("./bootstrapEPL");
setTimeout(function(){
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

app.listen(process.env.PORT||4545,function(){
    console.log("server listening on",4545)
})
},3000)},50000);