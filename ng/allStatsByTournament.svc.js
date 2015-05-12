/**
 * Created by chaitanyakrishna on 5/8/2015.
 */
angular.module("epl")
    .service("TournamentStats",function($http){
        this.fetch=function(){
            return $http.get("/api/totalGoals");
        }
        this.getTopGoalScorers=function(){
            return $http.get("/api/topScorers");
        }
        this.getTopGoalKeepers=function(){
            return $http.get("/api/topKeepers");
        }
    })