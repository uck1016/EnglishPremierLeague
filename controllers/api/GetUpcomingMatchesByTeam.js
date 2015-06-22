/**
 * Created by chaitanyakrishna on 4/18/2015.
 */
var router=require("express").Router();
var mongoClient=require("mongodb").MongoClient;
var _=require("lodash");
var globals=require("../../Globals");
var config=new globals();
var helpers=require("../../Helpers")
var helper=new helpers();
//Holds th final weekly matchSchedule details


router.get("/api/getUpcomingMatches",function(req,res){
    console.log("insde get upcoming matches")
    GetUpcomingMatchSchedule(function(matchSchedule){
    res.json(matchSchedule);
    })
})

function GetUpcomingMatchSchedule(callback){
    GetDocumentsFromMongo(function(remaining_matches){
        GetMatchesByTeam(remaining_matches,function(matchesByTeam){
            GetTeamLogos(matchesByTeam,function(matchesByTeamWithLogos){
                callback(matchesByTeamWithLogos);
            })
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
            db.close();
            callback(remaining_matches_array);
        })
    })
}

function GetMatchesByTeam(remaining_matches_array,callback){
    var upcoming_matches=[];
    for(var i in remaining_matches_array)
     {
        var team_name=remaining_matches_array[i]._id;
        var games={};
        games["team_name"]=team_name;
        games["matches"]=[];
        //console.log(matches_by_team.remaining_matches.length);
            for(var j in remaining_matches_array[i].remaining_matches){
                //console.log("*****"+match_by_week);
                //2nd element of the array "match_by_week" holds the week number alias the match number
                //games array holds the array's of upcoming weekly matches
                //thus create an empty array for each week, as we encounter new week,and because we are iterating through all the teams, check for uniqueness
                /* if (!games[match_by_week[1]]) {
                 games[match_by_week[1]] = [];
                 }*/
                if(j<3)
                helper.getMatchBrief(remaining_matches_array[i].remaining_matches[j],team_name,function(matchDetail){
                    games["matches"].push(matchDetail);
                })

            }
         upcoming_matches.push(games);
    }
    callback(upcoming_matches);
}

function GetTeamLogos(matchesByTeam,callback){
    mongoClient.connect(config.url,function(err,db){
     var team_collection=db.collection(config.pointsTable_collection);
        team_collection.aggregate([{"$group":{"_id":"$_id","logo_url":{"$first":"$logo_url"}}},{"$sort":{"_id":1}}],function(err,logosArray){
            db.close();
            for(var i in matchesByTeam){
                var teamName=matchesByTeam[i].team_name;
                var team_logo_url=_.result(_.findWhere(logosArray,{"_id":teamName}),"logo_url")
                matchesByTeam[i]["logo_url"]=team_logo_url;
                /*for(var j in matchesByTeam[i].matches){
                    var homeLogo= _.result(_.findWhere(logosArray,{"_id":matchesByTeam[i].matches[j].homeTeam}),"logo_url");
                    matchesByTeam[i].matches[j]["homeLogo"]=homeLogo;
                    var awayLogo=_.result(_.findWhere(logosArray,{"_id":matchesByTeam[i].matches[j].awayTeam}),"logo_url");
                    matchesByTeam[i].matches[j]["awayLogo"]=awayLogo;
                }*/
            }
            callback(matchesByTeam);
        })
    })
}

module.exports=router;