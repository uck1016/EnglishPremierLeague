/**
 * Created by chaitanyakrishna on 4/1/2015.
 */
var mongoClient=require("mongodb").MongoClient;
var globals=require("../../globals");
var config=new globals();
var router=require("express").Router();
var playerDetail;
router.post("/api/getPlayerData",function(req,res){
    var playerId=req.body.playerId;
    getPlayerInfo(playerId,function(result){
        res.json(result);
    })
})
function getPlayerInfo(playerId,callback){
    mongoClient.connect(url,function(err,db){
        var collection=db.collection("epldata");
        collection.find({"_id":playerId},{first_name:1,second_name:1,type_name:1,goals_scored:1,assists:1,yellow_cards:1,red_cards:1},function(err,data){
            data.toArray(function(err,res){
            console.log(res);
                db.close();
                callback(res);
            })
        })
    })
}
module.exports=router;