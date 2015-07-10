/**
 * Created by chaitanyakrishna on 5/7/2015.
 */
var router=require("express").Router();
var mongoClient=require("mongodb").MongoClient;
var _=require("lodash");
var globals=require("../../globals");
var config=new globals();
var helpers=require("../../Helpers")
var helper=new helpers();

router.get("/api/goalsByTeam",function(req,res){
    GetGoalStatsByTeam(function(result){
        console.log(result);
        res.json(result);
    })
})

function GetGoalStatsByTeam(callback){
    mongoClient.connect(config.url,function(err,db){
        var filter={"$match":{"type_name":{"$nin":["Goalkeeper"]}}};
        var groupByTeam={"$group":{"_id":{"team_name":"$team_name","type_name":"$type_name"},"goals":{"$sum":"$goals_scored"}}};
        var projectAs={"$group":{"_id":"$_id.team_name","categories":{"$push":{"type_name":"$_id.type_name","goals_scored":"$goals"}},
            "total_goals":{"$sum":"$goals"}}};
        var sortBy={"$sort":{"total_goals":-1}};
        db.collection(config.players_collection).aggregate([filter,groupByTeam,projectAs,sortBy],function(err,result){
            db.close();
            callback(result);
        });
    })

}

module.exports=router;

