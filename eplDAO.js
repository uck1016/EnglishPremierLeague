/**
 * Created by chaitanyakrishna on 2/27/2015.
 */
var globals=require("./globals");
var config=new globals();

var helper=new require("./helpers")();

var mongo_factory=require("mongo-factory");

var fs=require("fs");
//array holding the resource url of logo_image for each team along with the team_id
var team_logos=[];
var myTeam=require("./myTeam");

var eplDAO=function(){

}

//getStarted();
//AccumulateLogos();
//UploadLogos()
//getTable();
eplDAO.prototype.getStarted=function(callback) {
    mongo_factory.getConnection(config.url).then(function(db){
        db.dropCollection(config.teams_collection,function(){
            console.log("Dropping existing teams collection");
        })

        var players_collection = db.collection(config.players_collection);
        var teams_collection = db.collection(config.teams_collection);

        //players of element_type:1 are goal keepers who most certainly are with their team from the start of the season and thus the document holds all completed matches for that team

        var match={"$match":{"element_type":1,"_id":{"$lt":500}}};
        //we are grouping by team name to gather the all the completed match results for each team
        var groupBy={
            "$group": {
                "_id": {"_id":"$team_name",
                    "team_id":"$team_id","next_fixture":"$next_fixture"},
                "count": {"$first": "$fixture_history.all"}
            }
        }

        players_collection.aggregate([match,groupBy], function (err, data) {
            for (var i in data) {
                //console.log(data[i]._id._id + "*****" + data[i].count.length);
                if (data[i].count.length >= 24) {
                        teams_collection.insert(data[i], function (err, data) {
                        });
                }
                else {
                    //console.log(data[i]._id._id);
                }
            }
             //db.close();
            callback();
        })
    })
}

//Function to load team logos (image files) from source directory,
//sort them alphabetically w.r.t team name and assign a ID to each logo which is in consistent with team_id of the original data set
eplDAO.prototype.AccumulateLogos=function(){
    var dir=config.team_logos_directory;
    fs.readdir(dir,function(err,team_logo_files){

    var sorted_team_logo_files=team_logo_files.sort();
        var p=1;
    for(var i in sorted_team_logo_files){
        if(sorted_team_logo_files[i])
            team_logos.push({"_id":p++,"img_src":dir+sorted_team_logo_files[i]});
    }
    uploadLogos(team_logos);
    })
}
eplDAO.prototype.GeneratePointsTable=function(callback){
    var upperResult;
    mongo_factory.getConnection(config.url).then(function(db){
        var teams_collection=db.collection(config.teams_collection);
        teams_collection.find(function(err,teamsCursor){
            teamsCursor.toArray(function(err, teamsArray){
                gatherResults(teamsArray,function(resultArray){
                    upperResult=resultArray;
                    callback(upperResult);
                });

            });
        })
    })
}

// function to store the calculated points table into mongodb.

eplDAO.prototype.insertPointsTable=function(pointsTable,callback){
    //console.log(pointsTable);
    mongo_factory.getConnection(config.url).then(function(db){

        db.dropCollection(config.pointsTable_collection,function(err){
                console.log("dropped existing collection");
        })
        var points_table=db.collection(config.pointsTable_collection);
        console.log("bootstrapping collection");
        points_table.insert(pointsTable,function(err,data){
            callback();
        })
    })
}
// function to compute EPL points table
function gatherResults(items,callback){
    var pointsTable=[];
    var iterator=0;
    for(var team in items) {
        var team_name = items[team]._id._id;
        var team_id=items[team]._id.team_id;
        var next_fixture=items[team]._id.next_fixture;
        var resultsArray = [];
        var matchResultsContainer = items[team].count;
        for (var i in matchResultsContainer) {
            //console.log(matchResultsContainer[i][2]);
            resultsArray[i] = matchResultsContainer[i][2];
        }
        result = calculateResults(team_name, team_id,resultsArray,next_fixture);
        pointsTable[iterator++] = result;

    }
    callback(pointsTable);
}


// Internal function to calculate the overall stats for each team and return the stats as a record.

function calculateResults(team_name,team_id,record,next_fixture){
    var totalWins=0;
    var draws=0;
    var totalLost=0;
    var totalPoints=0;
    var totalGamesPlayed=record.length;
    var winPoints=3;
    var drawPoints=1;
    var goalsForwarded=0;
    var goalsAllowed=0;
    var goalDifference=0;
    var nextMatch=next_fixture;
    var webName=config.getWebName(team_name);
    //console.log(nextMatch);
    //console.log(record.length);
    if(record){
        for (var index=0;index<record.length;index++){
            var result=record[index].slice(7);
            if(result) {
                goalsForwarded += parseInt(result.charAt(0).valueOf());
                goalsAllowed += parseInt(result.charAt(2));
                if (result.charAt(0) > result.charAt(2)) totalWins++;
                else if (result.charAt(0) < result.charAt(2)) totalLost++;
                else draws++;
            }
            else if(!result){
                totalGamesPlayed--;
            }
        }
    }
    goalDifference=goalsForwarded-goalsAllowed;
    totalPoints= (totalWins*winPoints)+(draws*drawPoints);
    var teamRecord=new myTeam(team_name,team_id,webName,totalGamesPlayed, totalWins, totalLost, draws, goalsForwarded,goalsAllowed, goalDifference,totalPoints,nextMatch );
    return teamRecord;
}

// internal function to store the image files as base64 encoded strings into mongodb
function uploadLogos(team_logo_files){
 //temporary storage for encoded strings
    var p=1;
    var final_result=[];

    for(var i in team_logo_files) {
        var image_string = fs.readFileSync(team_logo_files[i].img_src, "base64");
        final_result.push({"_id":p++,"img_src":image_string});
    }

    mongo_factory.getConnection(config.url).then(function(db){
        var points_table=db.collection(config.pointsTable_collection);
        var q=0;
    for(var i in final_result) {
        q++;
        var query={"team_id":q};
        var operator={"$set":{"logo_url":final_result[i].img_src}}

       points_table.update(query,operator,function(err,data){
            //console.log(data);
            setTimeout(function(){
                db.close();
            },1000);
        })

    }

})
}
module.exports=eplDAO;



