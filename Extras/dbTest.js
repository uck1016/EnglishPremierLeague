/**
 * Created by chaitanyakrishna on 2/28/2015.
 */

var mongoClient=require("mongodb").MongoClient;
var results;
var collection_name;
var url="mongodb://localhost:27017/schools";
mongoClient.connect(url,function(err,db) {
    collection_name = db.collection("students");
    var cur = collection_name.find({});
    cur.each(function(err,doc){
        if(doc) {
            console.log(doc._id);
            var index = 0;
            var least_score = 10000;
            var scores_array = doc.scores;
            //console.log(scores_array);
            for (var i in scores_array) {
                if (scores_array[i].type ==="homework") {
                    if (scores_array[i].score < least_score) {
                        least_score = scores_array[i].score;
                    }
                }
            }
            collection_name.update({"_id":doc._id},{"$pull":{"scores":{"type":"homework","score":least_score}}},function(err,data){
                console.log(data);
            })
        }

    })
})


