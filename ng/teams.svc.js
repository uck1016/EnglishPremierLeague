/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .service("TeamService",function($http){
    this.fetch=function(){
        return $http.get("/api/teams");
    }
})