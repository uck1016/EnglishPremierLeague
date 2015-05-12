/**
 * Created by chaitanyakrishna on 4/9/2015.
 */
angular.module("epl")
    .service("MatchScheduleService",function($http){
        this.fetch=function(){
            return $http.get("/api/getMatchSchedule");
        }
    })