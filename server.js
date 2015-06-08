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
//EplDriver Object has the properties defined to get data-objects from REST-API, alter the key set of the objects and
//store the objects to mongoDB.
var EplDriver=new eplDriver();
EplDriver.Test();
// Function call to the REST client consuming data objects
EplDriver.GetDataFromAPI(function(eplDataSet){
    EplDataSet=eplDataSet;
    console.log(EplDataSet.length);
    //Function call to obtain the keySet necessary for the application's access pattern.
    EplDriver.getEplKeySet(function(eplKeySet){
        EplKeySet=eplKeySet;
        //Function call to limit the keySet of the data-objects
        EplDriver.FilterEplDataSet(EplDataSet,EplKeySet,function(result){
            EplDataSet=result;
            //console.log(Object.keys(EplDataSet[0]).length);
            //Function call modify the keySet of the data-Objects
            EplDriver.AlterEplDataSet(EplDataSet,function(finalResult){
                EplDataSet=finalResult;
                //Function call to store the data-objects as documents to mongoDB
                EplDriver.StoreToMongo(EplDataSet);
            });
        })
    });
});
setTimeout(function(){
    //bootstrapEPL is triggered on start of the server as it creates other necessary collections in mongoDB,
    //required for application functionality.
    var startEPL=require("./bootstrapEPL");
        setTimeout(function(){
            //Below code loads all the REST API's defined for the user inter-activity.
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

            app.listen(process.env.PORT||4545,function(){
                console.log("server listening on",4545)
            })
        },3000)
},55000);