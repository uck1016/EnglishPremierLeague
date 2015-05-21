/**
 * Created by chaitanyakrishna on 4/7/2015.
 */
var config=function(){
    //var urll=process.env.MONGOLAB_URI+"/test";
    this.url= process.env.MONGOLAB_URI+"/test"|| "mongodb://localhost:27017/test";
    this.port=4545;
    this.host="localhost";

    this.dbName="epl2015";
    this.players_collection="epldata";
    this.teams_collection="teams_collection";
    this.pointsTable_collection="eplpointstable";

    this.playerURL="http://fantasy.premierleague.com/web/api/elements/";
    this.aws_s3_bucket_name="epl-repository";
    this.aws_s3_key_name= "eplKeySet.txt";

    this.team_logos_directory="./assets/logos/";
    this.getWebName= function (teamName){
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
}
module.exports=config;