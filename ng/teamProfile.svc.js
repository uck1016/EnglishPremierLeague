/**
 * Created by chaitanyakrishna on 3/28/2015.
 */

angular.module("epl")
    .service("TeamProfileSvc",function($http){
        this.fetch=function(teamName){
            return $http.post("/api/getTeamData",{"teamName":teamName});
        }
        this.fetchPlayer=function(playerId){
            return $http.post("/api/getPlayerData",{"playerId":playerId})
        }
        this.fetchTeamBrief=function(teamName){
            return $http.post("/api/getTeamBrief",{"teamName":teamName})
        }
    })
