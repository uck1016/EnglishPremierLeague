/**
 * Created by chaitanyakrishna on 4/2/2015.
 */
var mongoClient=require("mongodb").MongoClient;
var globals=require("../../globals");
var config=new globals();
var router=require("express").Router();
var team_abbr;

router.post("/api/getTeamBrief",function(req,res){
    getTeamBrief(req.body.teamName,function(data) {
        res.json(data);
    })

})

function getTeamBrief(teamName,callback){
    team_abbr=teamName.slice(0,3).toUpperCase();
    var pointsRecord;
    var upcomingMatches=[];
    var last3Matches=[]
    mongoClient.connect(config.url,function(err,db){
        var collection=db.collection(config.pointsTable_collection);
        var collection_epldata=db.collection(config.players_collection);
        collection.findOne({"_id":teamName},function(err,data){
            pointsRecord=data;
            collection_epldata.findOne({"team_name":teamName},{"fixture_history.all":{"$slice":-3},"fixture_summary.all":1},function(err,data){
                last3Matches=data.fixture_history.all;
                collection_epldata.findOne({"team_name":teamName},{"fixtures.summary":1},function(err,upcomingMatches){
                    upcomingMatches=upcomingMatches.fixtures.summary;
                    db.close();
                    AppendTeamBriefDetails(pointsRecord,upcomingMatches,last3Matches,function(teamBriefRecord){
                        console.log(teamBriefRecord);
                        callback(teamBriefRecord);
                    })
                })
            })
        })
    })
}

function AppendTeamBriefDetails(pointsRecord,upcomingMatches,last3Matches,callback){
    var teamBriefRecord=pointsRecord;
    var last3Results=[];
    var modifiedLast3Results=[];
    var modifiedUpcomingMatches=[];
    for(var i in upcomingMatches){
        var eachMatch=upcomingMatches[i];
            var item=[];
            item.push(eachMatch[0]);
            var opponent=eachMatch[1].slice(0,3);
            var location=eachMatch[1].substr(5,1);

        //console.log("*******"+eachMatch[2].toString());

            if(location==="H"){
                item.push(team_abbr+" - "+opponent);
            }else if(location==="A"){
                item.push(opponent+" - "+team_abbr);
            }
            else{
                item.push("TBA")
            }
        if(eachMatch[2]!="-") {
            item.push(eachMatch[2].toUTCString().slice(0,12) + eachMatch[2].toLocaleTimeString().slice(0,5)+" EST");
        }else{
            item.push("TBA");
        }
        modifiedUpcomingMatches.push(item);
    }


    teamBriefRecord["upcomingMatches"]=modifiedUpcomingMatches;
    for(var i in last3Matches){
        last3Results.push(last3Matches[i][1]+" "+last3Matches[i][2]);
    }
    for(var j in last3Results){
            var items=last3Results[j].split(" ");
            var opponent=items[1].slice(0,3);
            var location=items[1].substr(4,1);
            if(location==="H"){
                modifiedLast3Results.push(team_abbr+" "+items[2]+" "+opponent);
            }
            else if(location==="A"){
                var result=items[2].split('').reverse().join();

                modifiedLast3Results.push(opponent+" "+result.slice(0,1)+result.slice(2,3)+result.slice(4)+" "+team_abbr);
            }
    }
    teamBriefRecord["last3matches"]=modifiedLast3Results;
    callback(teamBriefRecord);
}
module.exports=router;