/**
 * Created by chaitanyakrishna on 3/17/2015.
 */
var gulp=require("gulp");
var concat=require("gulp-concat");
var fs=require("fs");
fs.readdirSync(__dirname+"/gulp").forEach(function(task){
require("./gulp/"+task);
})
gulp.task("watch:js",["js"],function(){
    gulp.watch("/ng/**/*.js",["js"]);
})