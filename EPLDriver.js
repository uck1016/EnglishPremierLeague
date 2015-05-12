/**
 * Created by chaitanyakrishna on 3/23/2015.
 */

var globals=require("./globals");
var config=new globals();
var mongo_factory=require("mongo-factory");

var AWS=require("aws-sdk");
AWS.config.update({accessKeyId: 'AKIAITH3I536I4RXVPKA', secretAccessKey: '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'});
AWS.config.update({region: 'us-east-1'});
var s3= new AWS.S3();
//var syncRequest=require("sync-request");
var request = require("request");
var assert= require("assert");

var eplDriver =function(){

}
eplDriver.prototype.GetDataFromAPI=function(cb){
    var eplDataSet=[];
    for(var i=1;i<691;i++) {
        var playerURI=config.playerURL+i+"/";
        request.get(playerURI,function(err, response, body) {
            eplDataSet.push(JSON.parse(body));
            //console.log(new Date().getMinutes())
        });
    }
    setTimeout(function(){
        cb(eplDataSet);
    },30000);

};
eplDriver.prototype.getEplKeySet=function(callback){
    s3.getObject({Bucket:config.aws_s3_bucket_name,Key:config.aws_s3_key_name},function(err,res){
        var body=res.Body;
        var eplKeySet=(body).toString("utf8");
        callback(eplKeySet);
    });
}
eplDriver.prototype.FilterEplDataSet=function(eplDataSet,eplKeySet,callback){
    var EplDataSet=[];
    var requiredAttributes=eplKeySet.split("/");
    for(var j in eplDataSet){
         //console.log(Object.keys(eplDataSet[j]).length);
        var itemKeySet=Object.keys(eplDataSet[j]);
        for(var attribute in itemKeySet){
            if(requiredAttributes.indexOf(itemKeySet[attribute])==-1){
                delete eplDataSet[j][itemKeySet[attribute]];
            }
        }
    }
    callback(eplDataSet);

}
eplDriver.prototype.AlterEplDataSet=function(eplDataSet,callback){
    //Modifying the date string to date object in the key name "fixtures.all" holding all upcoming fixtures
    for(var each in eplDataSet){
        eplDataSet[each]["_id"]=eplDataSet[each]["id"];
        delete eplDataSet[each]["id"];
        var fixtures_all=eplDataSet[each]["fixtures"]["all"];
        for(var i in fixtures_all){
            if(fixtures_all[i][0].length>5){
                var d = GetDate(fixtures_all[i], 0);
                eplDataSet[each]["fixtures"]["all"][i][0] = d;
            }
        }
    }
    //Modifying the date string to date object in the key name "fixtures.summary" holding the last three fixtures
    for(var each in eplDataSet){
        var fixtures_summary=eplDataSet[each]["fixtures"]["summary"];
        for(var i in fixtures_summary){
            if(fixtures_summary[i][2].length>5) {
                var d = GetDate(fixtures_summary[i], 2);
                eplDataSet[each]["fixtures"]["summary"][i][2] = d;
            }
        }
    }
    callback(eplDataSet);
}
eplDriver.prototype.StoreToMongo=function(eplDataSet){
    mongo_factory.getConnection(config.url).then(function(db){
        db.dropCollection(config.players_collection,function(){
            console.log("dropping existing collection");
        });
        var epldata=db.collection(config.players_collection);
        epldata.insert(eplDataSet,{w:1},function(err,res){
            //assert.equals(null,err);
            console.log("updating database")
            db.close();
        })

    })
}
eplDriver.prototype.Test=function(){

}
function GetDate(item,index){
    var DateInString=item[index];
    var x= new Date(DateInString.substring(0,7)+"2015"+DateInString.substring(6)+" GMT");
    return x;
}
module.exports=eplDriver;
