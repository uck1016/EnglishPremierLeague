/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .service("PointsTableService",function($http){
    this.fetch=function(){
        return $http.get("/api/standings");
    }
})