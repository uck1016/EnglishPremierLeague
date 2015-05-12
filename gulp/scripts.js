/**
 * Created by chaitanyakrishna on 5/11/2015.
 */
var gulp=require("gulp");
var concat=require("gulp-concat");
gulp.task("js",function(){
    gulp.src(["ng/module.js","ng/**/*.js"])
        .pipe(concat("epl.js"))
        .pipe(gulp.dest("assets"))
})