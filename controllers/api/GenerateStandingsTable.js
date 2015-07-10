/**
 * Created by chaitanyakrishna on 3/5/2015.
 */
var mongoClient=require("mongodb").MongoClient;
var _=require("lodash");
var globals=require("../../globals");
var config=new globals();
var router=require("express").Router();
var webSockets=require("../../websockets");

router.get("/api/standings",function(req,res){
            getTable(function (data) {
                console.log(data);
                //webSockets.broadcast("new_post",{note:"EPL 15/16 season kick starts on august 5"});
                res.json(data);
            })
})
function getTable(callback){
    mongoClient.connect(config.url,function(err,db){
        var leagueTable=db.collection(config.pointsTable_collection);
        leagueTable.find({},{"logo_url":0}).sort({"points":-1,"goal_difference":-1},function(err,result){
            if(err){
            }
            result.toArray(function(err,resArray)
            {
                db.close();
                callback(resArray);
            })
        })
    })
}
module.exports=router;