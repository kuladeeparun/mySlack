var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
    //_id : Schema.Types.ObjectId,
	employeeID : String,
    teamID : String,
    taskDescription : String,
    //taskHistory : {type:Array, default:[taskDescription]},
    taskHistory : Array,
    assignedBy : String,    
    //endDate : Date,
    archived : {type:Boolean, default:false},
    archivedBy : String,
    rating : String
},
{timestamps:true});

tasksSchema.pre('save', function(){
    this.taskHistory.push(this.taskDescription);
});

mongoose.model("tasks", tasksSchema);

module.exports = mongoose.model('tasks');