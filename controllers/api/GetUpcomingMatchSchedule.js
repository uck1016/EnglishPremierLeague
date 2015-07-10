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
//Holds th final weekly matchSchedule details
var games={};


router.get("/api/getMatchSchedule",function(req,res){
console.log("inside get schedule");
       GetUpcomingMatchSchedule(function(matchSchedule){
            res.json(matchSchedule);
        })
})

function GetUpcomingMatchSchedule(callback){
        GetDocumentsFromMongo(function(remaining_matches){
            GetMatchesByWeek(remaining_matches,function(matchesByWeek){
                callback(matchesByWeek);
            });
        })
}

function GetDocumentsFromMongo(callback){
    mongoClient.connect(config.url,function(err,db){
        console.log("inside mongo");
        var players_collection=db.collection(config.players_collection);
        var groupBy={"$group":{"_id":"$team_name","remaining_matches":{"$first":
            "$fixtures.all"}}};
        players_collection.aggregate([groupBy],function(err,remaining_matches_array){
            callback(remaining_matches_array);
        })
    })
}

function GetMatchesByWeek(remaining_matches_array,callback){
    remaining_matches_array.forEach(function(matches_by_team) {
        var team_name=matches_by_team._id;
        matches_by_team.remaining_matches.forEach(function (match_by_week) {
            //console.log("*****"+match_by_week);
            //2nd element of the array "match_by_week" holds the week number alias the match number
            //games array holds the array's of upcoming weekly matches
            //thus create an empty array for each week, as we encounter new week,and because we are iterating through all the teams, check for uniqueness
            if (!games[match_by_week[1]]) {
                games[match_by_week[1]] = [];
            }
            helper.getMatchBrief(match_by_week,team_name,function(matchDetail){
                if(_.findIndex(games[match_by_week[1]],matchDetail)<0)
                    games[match_by_week[1]].push(matchDetail)
            })
        })
    })
    callback(games);
}
module.exports=router;