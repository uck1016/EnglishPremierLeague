/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .controller("PointsTableController",function($scope,PointsTableService,MatchScheduleService,MatchResultsService,$routeParams,$animate,$location) {
    PointsTableService.fetch().success(function (standings) {
        if($scope.standings==null) $scope.standings = standings;
    })
    MatchScheduleService.fetch().success(function(matchSchedule){
        if($scope.matchSchedule==null) $scope.matchSchedule=matchSchedule;
        $scope.weeks=Object.keys(matchSchedule);
        $scope.counter=0;

    })
    MatchResultsService.fetch().success(function(matchResults){
        if($scope.matchResults==null) $scope.matchResults=matchResults;
        $scope.matchWeeks=Object.keys(matchResults);
        $scope.resultWeekCounter=$scope.matchWeeks.length-1;
    })
        $scope.matchSchedule=null;
    $scope.standings=null;
        $scope.selectedIndex=0;
        $scope.disbledPrev=false;
        $scope.disabledNext=false

        $scope.highlight=function($index){
            $scope.selectedIndex=$index;
        }

        $scope.getSchedule=function(id){
            if(id=="next") {
                if($scope.counter==$scope.weeks.length-1) $scope.disabledNext=true;
                 else   {
                    $scope.counter++;
                    $scope.disabledPrev=false;
                }
            }
            else if(id=="prev") {
                if($scope.counter==0) $scope.disabledPrev=true;
                else {
                    $scope.counter--;
                    $scope.disabledNext=false;
                }
            }
        }
        $scope.getResult=function(id) {
            if (id == "next") {
                if ($scope.resultWeekCounter == $scope.matchWeeks.length - 1) $scope.disabledResultNext = true;
                else {
                    $scope.resultWeekCounter ++;
                    $scope.disabledResultPrev = false;
                }
            }
            else if (id == "prev") {
                if ($scope.resultWeekCounter  == 0) $scope.disabledResultPrev = true;
                else {
                    $scope.resultWeekCounter --;
                    $scope.disabledResultNext = false;
                }
            }
        }
})