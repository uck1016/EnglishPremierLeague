/**
 * Created by chaitanyakrishna on 4/8/2015.
 Typically a Driver module that handles all the intermediate business logic implemented at the run time of the application.
 */
var helper=function(){

}
helper.prototype.getMatchBrief=function(matchDetails,team_name,callback){
    //we modify the matchDetails object and store the details, in brief, of the match in a match detail object of keys
    //"homeTeam","awayTeam","matchTime"
    var matchDetail={};
    //matchDetails object is an array of length 3
    //last element of the array holds the opponent team and the venue(home(H) or away(A)) in the format "teamName (A)"
    var opponent_items=matchDetails[2].split("(");
    var opponent=opponent_items[0].trim();
    var venue=opponent_items[1];
    //determine the venue to appropriately assign the home and away teams
   if(venue==='H)') {
        matchDetail.homeTeam=team_name;
        matchDetail.awayTeam=opponent;
    }
    else{
        matchDetail.homeTeam=opponent;
        matchDetail.awayTeam=team_name;
    }
    // the first element of the match details array holds the match time
    // storing the match time(which is a date object) in a compact user readable form
    if(matchDetails[0]!="-") {
        matchDetail.matchTime=(matchDetails[0].toUTCString().slice(0,12) + matchDetails[0].toLocaleTimeString().slice(0,5)+" EST");
    }else{
        matchDetail.matchTime="TBA";
    }
    matchDetail.gameWeek=matchDetails[1];
    callback(matchDetail);
}

helper.prototype.getMatchResult=function(matchSummary,teamName,callback){
var team_name=GetWebName(teamName);
var match_result={};
//2nd element of the matchSummary array holds the match score, opponent and venuew in the format "team_name(venue) goals-goals"
var item=matchSummary[2];
    var opponent=item.slice(0,3);
    var location=item.substr(4,1);
    var score=item.slice(7);
    if(location==="H"){
        match_result.homeTeam=team_name;
        match_result.awayTeam=opponent;
        match_result.score=score;
    }
    else if(location==="A"){
        match_result.homeTeam=opponent;
        match_result.awayTeam=team_name;
        var result=item.slice(7).split('').reverse().join();
        match_result.score=result.slice(0,1)+result.slice(2,3)+result.slice(4);
    }

    callback(match_result);
}

GetWebName= function (teamName) {
    var team_web_name;
    if (teamName == "West Brom") team_web_name = "WBA";
    else if (teamName == "West Ham") team_web_name = "WHU";
    else if (teamName == "Spurs") team_web_name = "TOT";
    else if (teamName == "Aston Villa") team_web_name = "AVL";
    else if (teamName == "Man City") team_web_name = "MCI";
    else if (teamName == "Man Utd") team_web_name = "MUN";
    else if (teamName == "Stoke") team_web_name = "STK";
    else if (teamName == "QPR") team_web_name = "QPR";
    else {
        team_web_name = teamName.slice(0, 3);
    }
    return team_web_name.toUpperCase();
}

module.exports=helper;