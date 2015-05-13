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
var AWS=require("aws-sdk");
//AWS.config.update({accessKeyId: 'AKIAITH3I536I4RXVPKA', secretAccessKey: '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'});
AWS.config.update({region: 'us-east-1'});
var s3= new AWS.S3();
/*s3.getObject({Bucket:config.aws_s3_bucket_name,Key:config.aws_s3_key_name},function(err,res){
 var body=res.Body;
 var eplKeySet=(body).toString("utf8");
 callback(eplKeySet);
 });*/