/**
 * Created by chaitanyakrishna on 4/19/2015.
 */
angular.module("epl")
    .controller("UpcomingMatchesController",function($scope,UpcomingMatchesSvc,PointsTableService,$location,$anchorScroll){
        PointsTableService.fetch().success(function (standings) {
            if($scope.standings==null) $scope.standings = standings;
        })
        if($scope.upcomingMatches==null) {
            UpcomingMatchesSvc.fetch().success(function (upcomingMatchesByTeam) {

                $scope.upcomingMatches = upcomingMatchesByTeam;
            })
        }
        $scope.highlight=function($index){
            $scope.selectedIndex=$index;
        }
        $anchorScroll.yOffset = 50;
        $scope.scrollTo=function(x){
            $location.hash(x);
            $anchorScroll();
        }
    })