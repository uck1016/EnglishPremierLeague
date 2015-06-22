/**
 * Created by chaitanyakrishna on 3/23/2015.
 * Modules to create and load all the necessary collections on the MongoDB server, while the Node server is rebooting.
 */

var globals=require("./Globals");
var config=new globals();
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

