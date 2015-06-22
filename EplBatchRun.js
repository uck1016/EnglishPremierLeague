/**
 * Created by chaitanyakrishna on 3/24/2015.
 * Module to update and load all the English Premier League data objects in the backend and
 * make sure that the raw data collection is ready for running additional operations on it.
 */
var eplDriver=require("./EplDriver");
var EplKeySet;
var EplDataSet;
 //EplDriver Object has the properties defined to get data-objects from REST-API, alter the key set of the objects and
 //store the objects to mongoDB.
 var EplDriver=new eplDriver();
 EplDriver.Test();
 // Function call to the REST client consuming data objects
EplDriver.GetDataFromAPI(function(eplDataSet){
    EplDataSet=eplDataSet;
    console.log(EplDataSet.length);
    //Function call to obtain the keySet necessary for the application's access pattern.
    EplDriver.getEplKeySet(function(eplKeySet){
        EplKeySet=eplKeySet;
        //Function call to limit the keySet of the data-objects
        EplDriver.FilterEplDataSet(EplDataSet,EplKeySet,function(result){
            EplDataSet=result;
            //console.log(Object.keys(EplDataSet[0]).length);
            //Function call modify the keySet of the data-Objects
            EplDriver.AlterEplDataSet(EplDataSet,function(finalResult){
                EplDataSet=finalResult;
                //Function call to store the data-objects as documents to mongoDB
                EplDriver.StoreToMongo(EplDataSet);
            });
        })
    });
});
