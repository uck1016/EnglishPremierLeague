/**
 * Created by chaitanyakrishna on 3/24/2015.
 */
var eplDriver=require("./EPLDriver");
var EplKeySet;
var EplDataSet;
var EplDriver=new eplDriver();
EplDriver.Test();


EplDriver.GetDataFromAPI(function(eplDataSet){
    EplDataSet=eplDataSet;
    //console.log(EplDataSet.length);
    EplDriver.getEplKeySet(function(eplKeySet){
        EplKeySet=eplKeySet;
        EplDriver.FilterEplDataSet(EplDataSet,EplKeySet,function(result){
            EplDataSet=result;
            //console.log(Object.keys(EplDataSet[0]).length);
            EplDriver.AlterEplDataSet(EplDataSet,function(finalResult){
                EplDataSet=finalResult;
                EplDriver.StoreToMongo(EplDataSet);
            });
        })
    });
});
