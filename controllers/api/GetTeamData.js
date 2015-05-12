/**
 * Created by chaitanyakrishna on 3/28/2015.
 */
var mongoClient=require("mongodb").MongoClient;
var url="mongodb://localhost:27017/test";
var router=require("express").Router();
var squad=[];

router.post("/api/getTeamData",function(req,res){
    getSquad(req.body.teamName,function(squad){
        res.json(squad);
    });
})
function getSquad(teamName,callback){
mongoClient.connect(url,function(err,db){
    var epldata_collection=db.collection("epldata");
    epldata_collection.find({"team_name":teamName},
        {"first_name":1,"second_name":1,"type_name":1,"web_name":1}).sort({"total_points":-1},function(err,result){
            result.toArray(function(err,res){
                db.close();
                callback(res);
            });
        });
})
}
module.exports=router;
