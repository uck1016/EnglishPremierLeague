/**
 * Created by chaitanyakrishna on 4/7/2015.
 */

var _=require("lodash");
var globals=require("./../globals");
var config=new globals();
var mongo_factory=require("mongo-factory");
var games={};
var helpers=require("./../helpers")
var helper=new helpers();


var team_name=helper.GetWebName("QPR");
console.log(team_name);


/*mongo_factory.getConnection(config.url).then(function(db){
var players_collection=db.collection(config.players_collection);
    players_collection.aggregate([{"$group":{"_id":"$team_name","remaining_matches":{"$first":
        "$fixtures.all"}}}],function(err,remaining_matches_array){
        //console.log(typeof data);
        GetMatchesByWeek(remaining_matches_array,function(){
            console.log(games);
        });
    })
})
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
                //
                helper.getMatchBrief(match_by_week,team_name,function(gameBrief){
                    if(_.findIndex(games[match_by_week[1]],gameBrief)<0)
                        games[match_by_week[1]].push(gameBrief)
                })
            })
        })
    callback();
    }*/
    //},3);

