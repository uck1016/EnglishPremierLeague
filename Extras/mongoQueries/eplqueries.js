/**
 * Created by chaitanyakrishna on 3/4/2015.
 */
//to find the total matches played by each team
db.epldata.aggregate([{"$group":{"_id":"$team_name","matches":{"$max":{"$si
    ze":"$fixture_history.all"}}}}]);

//to find the total matches played by each player in a selected team.


//stats
test>db.epldata.aggregate([{"$match":{"type_name":{"$nin":["Goalkeeper"]}}},{"$g
    roup":{"_id":{"team_name":"$team_name","type_name":"$type_name"},"goals":{"$sum"
    :"$goals_scored"}}},{"$group":{"_id":"$_id.team_name","categories":{"$push":{"ty
    pe_name":"$_id.type_name","goals_scored":"$goals"}}}}]).pretty();