/**
 * Created by chaitanyakrishna on 3/23/2015.
 */
var globals=require("./globals");
var config=new globals();
var mongo_factory=require("mongo-factory");
var eplDAO=require("./eplDAO");
eplDAO=new eplDAO();
//eplDAO.AccumulateLogos();

eplDAO.getStarted(function(){
    eplDAO.GeneratePointsTable(function(pointsTable){
        eplDAO.insertPointsTable(pointsTable,function(){
            eplDAO.AccumulateLogos();
        });
    })
});
/*
function test(callback) {
    mongoClient.connect(url,function(err,db){
        var ptable=db.collection("ptable");
        ptable.find(function(err,data){
            //f(data) {
            data.toArray(function(err, dataray){
                console.log("****"+dataray);
            });
        })
    })
}*/
