/**
 * Created by chaitanyakrishna on 5/11/2015.
 */
var gulp=require("gulp");
var stylus=require("gulp-stylus");
gulp.task("css",function(){
    gulp.src("css/**/*.styl")
        .pipe(stylus())
        .pipe(gulp.dest("assets"));
})