/**
 * Created by chaitanyakrishna on 3/5/2015.
 Module to represent all the properties of the team Object, which are required by the application.
 */
var _id, team_id,totalPlayed, win, lost, draw, goals_forwarded, goals_allowed, goal_difference,points,nex_match;

myTeam=function myTeam(teamName,teamId,webName,totalGames, gamesWon, gamesLost, draws,gF, gA, gD, totalPoints,nextMatch){
    this.team_id=teamId;
    this._id=teamName;
    this.totaPlayed=totalGames;
    this.win=gamesWon;
    this.lost=gamesLost;
    this.draw=draws;
    this.goals_forwarded=gF;
    this.goals_allowed=gA;
    this.goal_difference=gD;
    this.points=totalPoints;
    this.next_match=nextMatch;
    this.web_name=webName;
    //console.log(totalPoints);

}

myTeam.prototype.printTeam=function(){
    console.log(this._id);
    console.log(this.points);
}
module.exports=myTeam;