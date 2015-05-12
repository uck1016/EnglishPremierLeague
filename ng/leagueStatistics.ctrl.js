/**
 * Created by chaitanyakrishna on 5/7/2015.
 */

angular.module("epl")
        .controller("StatisticsController",function($scope,GoalsByTeamService, TournamentStats){
        GoalsByTeamService.fetch().success(function(array){
            $scope.teams=array;
        })
       TournamentStats.fetch().success(function(array){
           $scope.totalGoalStats=array;
           var total_goals=0;
           for(var i in array){
               total_goals=total_goals+array[i].goals;
           }
           $scope.total_goals=total_goals;
        })
        TournamentStats.getTopGoalScorers().success(function(array){
            $scope.top_scorers=array;
        })
        TournamentStats.getTopGoalKeepers().success(function(array){
            $scope.top_keepers=array;
        })
    })