/**
 * Created by chaitanyakrishna on 3/27/2015.
 */
angular.module("epl")
    .config(function($routeProvider,$locationProvider){
        $routeProvider.when("/profile:teamName/:position?",{controller:"TeamProfileController",templateUrl:"teamProfile.html"});
    })
