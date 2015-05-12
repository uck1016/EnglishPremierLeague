/**
 * Created by chaitanyakrishna on 2/27/2015.*/
var mongo_factory=require("mongo-factory");
var url="mongodb://localhost:27017/";
mongo_factory.getConnection(url).then(function(db){
    console.log(db);
/*    db.databaseName="test";
    var collection=db.collection("epldata");
    collection.findOne(function(err,doc){
        //console.log(doc)*/
    })
module.exports=mongo_factory;