/**
 * Created by chaitanyakrishna on 3/23/2015.
 */
//globals module is having all the globals variables required by the application
var globals=require("./globals");
var config=new globals();
var mongoClient=require("mongodb").MongoClient;
var fs=require("fs");
var request = require("request");
var assert= require("assert");

var eplDriver =function(){

}
//Method to create the REST client and consume the response for each request.
eplDriver.prototype.GetDataFromAPI=function(callback){
    var eplDataSet=[];
    for(var i=1;i<491;i++) {
        var playerURI=config.playerURL+i+"/";
        request.get(playerURI,function(err, response, body) {
            //console.log(body);
            eplDataSet.push(JSON.parse(body));
            //console.log(new Date().getMinutes())
        });
    }
    setTimeout(function(){
        callback(eplDataSet);
    },60000);
};
//Method to read a configuration file containing the attributes (keys) required for the player Object
eplDriver.prototype.getEplKeySet=function(callback){
fs.readFile("./assets/eplKeySet.txt",function(err,data){
    var eplKeySet=(data).toString("utf8");
    callback(eplKeySet);
});
}
//Method to extract only the desired key-value pairs from each object in the eplDataSet
eplDriver.prototype.FilterEplDataSet=function(eplDataSet,eplKeySet,callback){
    var EplDataSet=[];
    var requiredAttributes=eplKeySet.split("/");
    for(var j in eplDataSet){
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
                //console.log(d);
                eplDataSet[each]["fixtures"]["all"][i][0] = d;
            }
        }
    }
    //Modifying the date string to date object in the key name "fixtures.summary" holding the last three fixtures
    /*for(var each in eplDataSet){
        var fixtures_summary=eplDataSet[each]["fixtures"]["summary"];
        for(var i in fixtures_summary){
            if(fixtures_summary[i][2].length>5) {
                var d = GetDate(fixtures_summary[i], 2);
                //console.log(d);
                eplDataSet[each]["fixtures"]["summary"][i][2] = d;
            }
        }
    }*/
    callback(eplDataSet);
}
//Method to store the data objects in mongoDB server.
eplDriver.prototype.StoreToMongo=function(eplDataSet){
    mongoClient.connect(config.url,function(err,db){
        db.dropCollection(config.players_collection,function(){
            console.log("dropping existing collections");
        });
        var epldata=db.collection(config.players_collection);
        epldata.insert(eplDataSet,{w:1},function(err,res){
            //assert.equals(null,err);
            console.log(res);
            console.log("updating database")
            db.close();
        })
    });
}
eplDriver.prototype.Test=function(){

}
function GetDate(item,index){
    var DateInString=item[index];
    var x;
    if(CheckDateInString(DateInString.substring(3,6)))
        x= new Date(DateInString.substring(0,7)+"2016"+DateInString.substring(6)+" GMT");
    else
        x=new Date(DateInString.substring(0,7)+"2015"+DateInString.substring(6)+" GMT");
    return x;
}

function CheckDateInString(month){
    //console.log (month);
    var next_year_months=["Jan","Feb","Mar","Apr","May"];
    if(next_year_months.indexOf(month)!=-1)return true;
    else return false;
}
module.exports=eplDriver;
