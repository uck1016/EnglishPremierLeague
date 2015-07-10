/**
 * Created by chaitanyakrishna on 5/8/2015.
 */

var router=require("express").Router();
var mongoClient=require("mongodb").MongoClient;
var _=require("lodash");
var globals=require("../../globals");
var config=new globals();

router.get("/api/totalGoals",function(req,res){
    GetTournamentGoalStats(function(result){
        //console.log("****"+result);
        res.json(result);
    })
})
router.get("/api/topScorers",function(req,res){
    GetTopScorers(function(result){
        //console.log("****"+result);
        res.json(result);
    })
})
router.get("/api/topKeepers",function(req,res){
    GetTopKeepers(function(result){
        //console.log("****"+result);
        res.json(result);
    })
})
function GetTournamentGoalStats(callback) {
    mongoClient.connect(config.url, function (err, db) {
        var filter={"$match":{"type_name":{"$nin":["Goalkeeper"]}}};
        var groupByPosition={"$group": {"_id": "$type_name", "goals": {"$sum": "$goals_scored"}}};
        var sortByGoals={"$sort":{"goals_scored":-1}};
        db.collection(config.players_collection).aggregate([filter,{"$group":{"_id":"$type_name","goals":{"$sum":"$goals_scored"}}},sortByGoals],function(err,doc){
            //console.log(doc);
            db.close();
            callback(doc);
        })
    })
}
function GetTopScorers(callback) {
    mongoClient.connect(config.url, function (err, db) {
        db.collection(config.players_collection).aggregate([{"$group":{"_id":{"id":"$_id","first_name":"$first_name","second_name":"$second_name","goals":"$goals_scored","team_name":"$team_name","position"
            :"$type_name"}}},{"$sort":{"_id.goals":-1}},{"$limit":5}],function(err,doc){
            console.log(doc);
            db.close();
            callback(doc);
        })
    })
}
function GetTopKeepers(callback) {
    mongoClient.connect(config.url, function (err, db) {
        db.collection(config.players_collection).aggregate([{"$group":{"_id":{"id":"$_id","first_name":"$first_name","second_name":"$second_name","saves":"$saves","team_name":"$team_name","position"
            :"$type_name"}}},{"$sort":{"_id.saves":-1}},{"$limit":5}],function(err,doc){
            console.log(doc);
            db.close();
            callback(doc);
        })
    })
}
module.exports=router;