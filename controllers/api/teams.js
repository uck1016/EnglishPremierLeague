/**
 * Created by chaitanyakrishna on 3/3/2015.
 */
var mongoClient=require("mongodb").MongoClient;
var router=require("express").Router();
var globals=require("../../globals");
var config=new globals();

router.get("/api/teams",function(req,res){
    getTeams(function(data) {
        res.json(data);
    })

})
function getTeams(callback){
    mongoClient.connect(config.url,function(err,db) {
        var collection = db.collection(config.pointsTable_collection);
        collection.find().sort({"points":-1,"goal_difference":-1}).toArray(function (err, data) {
            var result=data

                db.close();
                callback(result);
        })
    })
}
module.exports=router;