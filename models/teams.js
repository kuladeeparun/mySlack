var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamsSchema = new Schema({
    teamID : String,
    teamName : String,
    leads : Array,
    resources : Array
},
{timestamps:true});

var teams = mongoose.model("teams", teamsSchema);
/* 
var count;
var obj;


teamsSchema.pre('save', function(){    
    obj.teamID = count;    
});

teamsSchema.pre('save', function(next){
    obj = this;
    teams.find().sort({teamID:-1}).limit(1).exec(function(err, result){        
        count = (parseInt(result[0].teamID) + 1).toString();
        console.log(count);
        next();        
    });
    
});  */

/* teamsSchema.pre('save', function(next){
    console.log("first");
    next();
});

teamsSchema.pre('save', function(){
    console.log("second");
    //next();
}); */


module.exports = mongoose.model('teams');