/**
 * Created by chaitanyakrishna on 4/10/2015.
 */
angular.module("epl")
    .service("MatchResultsService",function($http){
        this.fetch=function(){
            return $http.get("/api/getMatchResults");
        }
    })