/**
 * Created by chaitanyakrishna on 4/8/2015.
 */
var gameweek=function Gameweek(id){
this.id=id;

}

gameweek.prototype.addMatch=function(id, match,date){
    this.id.push(match);
    console.log(this.id);
}
module.exports=gameweek;