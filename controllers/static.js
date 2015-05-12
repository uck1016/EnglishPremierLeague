/**
 * Created by chaitanyakrishna on 3/3/2015.
 */
var express=require("express");
var router=require("express").Router();
var path=require("path");
router.get("/",function(req,res){
    console.log("inside//");
    res.sendfile("layouts/teams.html");
})

router.get("/home.html",function(req,res){
    console.log("inside home");
    res.sendfile("layouts/home.html");
})

router.get("/standings.html",function(req,res){
    res.sendfile("layouts/pointsTable.html")
})

router.get("/upcomingMatches.html",function(req,res){
    res.sendfile("layouts/upcomingMatches.html")
})
router.get("/tournamentStats.html",function(req,res){
    res.sendfile("layouts/statistics.html")
})

router.use(express.static(__dirname+'/../assets'));
router.use(express.static(__dirname+'/../templates'));
module.exports=router;

