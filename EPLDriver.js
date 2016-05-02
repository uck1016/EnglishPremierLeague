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

Array.prototype.checkSize = function(){
    return this.length;
}

Array.prototype.construt = function(){
    for(var i = 0;i<this.length;i++){
        this[i] = 0;
    }
}

var eplDriver = function(){
    this.totalRecords = 0;

}
//Method to create the REST client and consume the response for each request.
eplDriver.prototype.GetDataFromAPI=function(callback){
    var eplDataSet=[];
    var p=1000000;
    for(var i=1;i<691;i++) {
        var playerURI=config.playerURL+i+"/";
        var self = i;
        request.get(playerURI,function(err, response, body) {
            //console.log("*****"+playerURI);
            if( body !== undefined) {
                try {
                    eplDataSet.push(JSON.parse(body));
                    console.log("The length is"+ eplDataSet.length)
                }
                catch(err){
                    console.log("error on url"+ Object.keys(this));
                }
            }else {
                console.log("******error on url"+ this.path);
            }

            //console.log(new Date().getMinutes())
        });
    }
    //console.log(eplDataSet.length);
    (function check(){
    setTimeout(function(){
        //console.log("length is"+ eplDataSet.length)
        if(eplDataSet.length >= 690) return callback(eplDataSet);
        else check();
    },150);
    })();
};

eplDriver.prototype.callAPI = function(callback){
    var res = this.buildRequests();
    var self = this;
    self.totalRecords = 0;
    self.epl = [];
    var k =0;
    for(var j =0; j<res.length; j++)
        res[j](config.playerURL + ++k + "/", self, function (err, response) {
            //console.log("************");
            if (response) {
                if (response.checkCount) {
                    response.checkCount();
                }
                if(!response.flag){
                    console.log("******"+" for url "+k+"  length is "+self.epl.length);

                    return callback(self.epl);
                }
            }
            //check(flag);
        });
}

function wait(){
    setTimeout(function(){

    }, 10000);
}
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
    var k = 0;
    console.log(eplDataSet.length);
    for(var j = 0 ; j<eplDataSet.length;j++){
        eplDataSet[j]["_id"]=eplDataSet[j]["id"];
        delete eplDataSet[j]["id"];
        var fixtures_all=eplDataSet[j]["fixtures"]["all"];
        for(var i in fixtures_all){
            if(fixtures_all[i][0] && fixtures_all[i][0].length>5){
                var d = GetDate(fixtures_all[i], 0);
                //console.log(d);
                eplDataSet[j]["fixtures"]["all"][i][0] = d;
            }
        }
        k++;
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
    console.log("inside store to mongo");
    mongoClient.connect(config.url,function(err,db){
        //console.log(Object.keys());
        db.dropCollection(config.players_collection,function(){
            console.log("dropping existing collections");
        });
        var epldata=db.collection(config.players_collection);
        epldata.insert(eplDataSet,{w:1},function(err,res){
            //assert.equals(null,err);
            console.log("updating database")
            db.close();
        })
    });
}
eplDriver.prototype.Test=function(){
    var playerURI=config.playerURL+701+"/";

    console.log("URL IS"+ playerURI+" Performing request");
    request.get(playerURI,function(err, response, body) {
        //console.log("*****"+body);
        if( body === undefined) {
            console.log("**********"+"*******");
        }
        //eplDataSet.push(JSON.parse(body));
        //console.log(new Date().getMinutes())
    });
}

eplDriver.prototype.getTotalRecords = function (){
    var flag = true;
    var playerURI = config.playerURL;
    var fun = this.makeRequest;
    var arr = new Array(10);arr.construt();
console.log(arr.checkSize())
    console.log(arr);
    var i = 1;
    var self = this;

arr.forEach(function(i, k){
    //console.log(this);
    var k = k+1;
    if(flag) {
        console.log("FLAG IS"+ flag)
        //console.log("Peforming request on" + playerURI + k + "/");
        fun(playerURI + k + "/",self, function (err, response) {
            //console.log("************");
            if (response) {
                if (response.checkCount) {
                    response.checkCount();
                }
                flag = response.flag;
                console.log("FLAG AFTER RESPONSE IS"+ flag);
            }
            //check(flag);
        });
    }
})
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

function check(flag){
    setTimeout(function(){
        if(!flag){
            //callback(eplDataSet);
            console.log("*****INSIDE*******");
            process.exit();
        }
        else check();
    },15000);
}

eplDriver.prototype.makeRequest = function(url, outerRequest, callback){
var self = outerRequest;
    console.log("Performing request on"+ url);
    request.get(url, function(err, res){
        //console.log(res.statusCode);
        if(err){
            console.log("error on url"+ url);
        }
        if( res.statusCode && res.statusCode === 200 ) {
            console.log("RESPONSE SUCCESS");
            self.epl.push(JSON.parse(res.body));
            res.checkCount = function(){
                self.totalRecords++;
                res.flag = true;
                console.log("*****"+self.totalRecords)
            }
        } else if(res.statusCode === 404) {
            console.log("*******FALSE");
            console.log("Error on"+ url);
            res.flag = false;
        }
        return callback(null,res);
    })
}

eplDriver.prototype.mongoTest = function(){
        console.log("inside store to mongo");
        mongoClient.connect(config.url,function(err,db){
            console.log(db.databaseName);
            //db.dropCollection(config.teams_collection,function(){
             //   console.log("dropping existing collections");
            //});
            var epldata=db.collection(config.teams_collection);
            epldata.find(function(err, res){
                var re = res.toArray(function(err, res){
                    console.log("****"+res.length);
                });
            })
            //epldata.insert(eplDataSet,{w:1},function(err,res){
                //assert.equals(null,err);
             //   console.log(res);
               // console.log("updating database")
                //db.close();
            //})
        });
}

eplDriver.prototype.buildRequests = function(){
    var arr = new Array(1000);
    for(var i = 0; i < arr.length; i++){
        arr[i] = this.makeRequest;
    }
    return arr;
}
function CheckDateInString(month){
    //console.log (month);
    var next_year_months=["Jan","Feb","Mar","Apr","May"];
    if(next_year_months.indexOf(month)!=-1)return true;
    else return false;
}
module.exports=eplDriver;
