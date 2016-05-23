/**
 * Created by uck on 4/30/16.
 */
//var eplDriver = require("./EPLDriver");
//var Obj = new eplDriver();
var fs = require("fs");
/*var G =  require("./globals");
var g = new G();


//Obj.Test();

var res = Obj.buildRequests();


//var x = res[0];
var self = this;
self.totalRecords = 0;
self.epl = [];
var url = g.playerURL + 701 + "/";
var k =0;
/!*for(var j =0; j<res.length; j++)
res[j](g.playerURL + ++k + "/", self, function (err, response) {
    //console.log("************");
    if (response) {

        console.log("length is"+ self.epl.length);
        if (response.checkCount) {
            response.checkCount();
        }
        if(!response.flag){
            process.exit();
        }
    }
    //check(flag);
});*!/
Obj.makeRequest(url,this,function(err, res){
    console.log("response is"+ res.statusCode);
})*/
//Obj.mongoTest();
var fs = require("fs");
var image_string = fs.readFileSync("./assets/logos/Arsenal-logo.png", "base64");

//console.log(image_string);

var fStream = fs.createWriteStream(require("path").join(process.cwd() +"/log", "uck.log"),{"flag" : "a"});

console.log(fStream);



