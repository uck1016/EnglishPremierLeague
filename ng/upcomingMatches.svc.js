/**
 * Created by chaitanyakrishna on 4/19/2015.
 */
angular.module("epl")
        .service("UpcomingMatchesSvc",function($http){
        this.fetch=function(){
            return $http.get("/api/getUpcomingMatches");
        }
    })