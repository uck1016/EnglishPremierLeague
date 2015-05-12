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