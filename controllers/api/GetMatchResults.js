/**
 * Created by chaitanyakrishna on 4/9/2015.
 */

var router=require("express").Router();
var mongoClient=require("mongodb").MongoClient;
var _=require("lodash");
var globals=require("../../globals");
var config=new globals();
var helpers=require("../../Helpers")
var helper=new helpers();

var games={};


router.get("/api/getMatchResults",function(req,res){
    //console.log("inside get all results");
    GetAllMatchResults(function(matchResults){
        //console.log(matchResults);
        res.json(matchResults);
    })
})

function GetAllMatchResults(callback){
    GetDocumentsFromMongo(function(completed_matches){
        GetMatchesByWeek(completed_matches,function(ResultsByWeek){
            callback(ResultsByWeek);
        });
    })
}

function GetDocumentsFromMongo(callback){
    mongoClient.connect(config.url,function(err,db){
        console.log("inside mongo");
        var players_collection=db.collection(config.players_collection);
        var groupBy={"$group":{"_id":"$team_name","match_results":{"$first":
            "$fixture_history.all"}}};
        players_collection.aggregate([groupBy],function(err,completed_matches_array){
            callback(completed_matches_array);
        })
    })
}

function GetMatchesByWeek(completed_matches_array,callback){
    completed_matches_array.forEach(function(matches_by_team) {
        var team_name=matches_by_team._id;
        matches_by_team.match_results.forEach(function (match_by_week) {
            //console.log("*****"+match_by_week);
            //2nd element of the array "match_by_week" holds the week number alias the match number
            //games array holds the array's of upcoming weekly matches
            //thus create an empty array for each week, as we encounter new week,and because we are iterating through all the teams, check for uniqueness
            if (!games[match_by_week[1]]) {
                games[match_by_week[1]] = [];
            }
            helper.getMatchResult(match_by_week,team_name,function(matchDetail){
                if(_.findIndex(games[match_by_week[1]],matchDetail)<0)
                    games[match_by_week[1]].push(matchDetail)
            })
        })
    })
    callback(games);
}
module.exports=router;