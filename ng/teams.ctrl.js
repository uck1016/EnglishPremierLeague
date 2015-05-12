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