/**
 * Created by chaitanyakrishna on 5/7/2015.
 */
angular.module("epl")
        .service("GoalsByTeamService",function($http){
        this.fetch=function() {
            return $http.get("/api/goalsByTeam");
        }
    })