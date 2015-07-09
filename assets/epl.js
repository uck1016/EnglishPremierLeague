/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl",["ngRoute"]);
/**
 * Created by chaitanyakrishna on 5/8/2015.
 */
angular.module("epl")
    .service("TournamentStats",function($http){
        this.fetch=function(){
            return $http.get("/api/totalGoals");
        }
        this.getTopGoalScorers=function(){
            return $http.get("/api/topScorers");
        }
        this.getTopGoalKeepers=function(){
            return $http.get("/api/topKeepers");
        }
    })
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
/**
 * Created by chaitanyakrishna on 5/7/2015.
 */
angular.module("epl")
        .service("GoalsByTeamService",function($http){
        this.fetch=function() {
            return $http.get("/api/goalsByTeam");
        }
    })
/**
 * Created by chaitanyakrishna on 4/10/2015.
 */
angular.module("epl")
    .service("MatchResultsService",function($http){
        this.fetch=function(){
            return $http.get("/api/getMatchResults");
        }
    })
/**
 * Created by chaitanyakrishna on 4/9/2015.
 */
angular.module("epl")
    .service("MatchScheduleService",function($http){
        this.fetch=function(){
            return $http.get("/api/getMatchSchedule");
        }
    })
/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .controller("PointsTableController",function($scope,PointsTableService,MatchScheduleService,MatchResultsService,$routeParams,$animate,$location) {
    /*$scope.$on("ws:new_post",function(_,post){
        $scope.$apply(function(){
            $scope.note=post;
            //alert($scope.note);
        })

    })*/
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
/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .service("PointsTableService",function($http){
    this.fetch=function(){
        return $http.get("/api/standings");
    }
})
/**
 * Created by chaitanyakrishna on 3/27/2015.
 */
angular.module("epl")
    .config(function($routeProvider,$locationProvider){
        $routeProvider.when("/profile:teamName/:position?",{controller:"TeamProfileController",templateUrl:"teamProfile.html"});
    })

/**
 * Created by chaitanyakrishna on 3/28/2015.
 */
/**
 * Created by chaitanyakrishna on 3/27/2015.
 */
angular.module("epl")
    .controller("TeamProfileController",function($scope,$routeParams,TeamProfileSvc,$animate,$anchorScroll,$location) {
        $scope.position=parseInt($routeParams.position)+1;
        $scope.teamName=$routeParams.teamName;
        $scope.strikers=[];
        $scope.midfielders=[];
        $scope.goalKeepers=[];
        $scope.defenders=[];
        $scope.show=[1,1,1,1];
        $scope.showDropDown=[0,0,0,0];
        $scope.showDropUp=[1,1,1,1];
        $scope.counter=[0,0,0,0];
        $scope.playerId=null;
        $scope.playerDetail=null;
        $scope.teamBrief=null;
        $scope.showPlayer=1;
        $scope.selectedIndex=null;


        $scope.validateCounter=function(counter,index){
            if(counter%2==0){
                $scope.show[index]=1;
                $scope.showDropDown[index]=0;
                $scope.showDropUp[index]=1;
            }
            else{
                $scope.show[index]=0;
                $scope.showDropDown[index]=1;
                $scope.showDropUp[index]=0;
                //pulling back all the surrounding panels
                for(var i in $scope.show){
                    if(i!=index) {
                        $scope.show[i]=1;
                        $scope.showDropDown[i]=0;
                        $scope.showDropUp[i]=1;
                        $scope.counter[i]=0;
                    }
                }

            }
        }

        $scope.getPlayer=function(playerId){
            $scope.showPlayer=0;
            $scope.playerId=playerId;
            TeamProfileSvc.fetchPlayer($scope.playerId).success(function(record){
                $scope.playerDetail=record[0];
            })
        }
        $scope.highlight=function($index){
            $scope.selectedIndex=$index;
        }

        TeamProfileSvc.fetch($scope.teamName).success(function(squad){
            $scope.squad=squad;
            for(var i in squad){
                if(squad[i]["type_name"]=="Midfielder"){
                    $scope.midfielders.push(squad[i]);
                }
                else if(squad[i]["type_name"]=="Defender"){
                    $scope.defenders.push(squad[i]);
                }
                else if(squad[i]["type_name"]=="Forward"){
                    $scope.strikers.push(squad[i]);
                }
                else if(squad[i]["type_name"]=="Goalkeeper"){
                    $scope.goalKeepers.push(squad[i]);
                }
            }
        });
        TeamProfileSvc.fetchTeamBrief($scope.teamName).success(function(teamBrief){
            $scope.teamBrief=teamBrief;
        })


    })
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

/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .controller("TeamsController",function($scope,TeamService) {
    TeamService.fetch().success(function (teams) {
        var classArray=['deg252','deg288','deg90','deg270','deg108','deg72','deg198','deg342','deg180', 'deg360','deg162','deg18','deg216','deg234','deg306','deg324','deg144','deg126','deg54','deg36'];
        $scope.teams=classArray.map(function(value,index){
            return {
                data: value,
                value: teams[index]
            }
        })
    })
})
/**
 * Created by chaitanyakrishna on 3/26/2015.
 */
angular.module("epl")
    .service("TeamService",function($http){
    this.fetch=function(){
        return $http.get("/api/teams");
    }
})
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
/**
 * Created by chaitanyakrishna on 4/19/2015.
 */
angular.module("epl")
        .service("UpcomingMatchesSvc",function($http){
        this.fetch=function(){
            return $http.get("/api/getUpcomingMatches");
        }
    })
/**
 * Created by chaitanyakrishna on 6/28/2015.
angular.module("epl")
.run(function($rootScope){
    var url="ws:localhost:4545";
    var connection=new WebSocket(url);
    connection.onopen=function(){
        console.log("web socket connected");
    connection.onmessage=function(e){
        console.log(e);
        var payload=JSON.parse(e.data)
        $rootScope.$broadcast('ws:' + payload.topic, payload.data);
    }
    }
})*/