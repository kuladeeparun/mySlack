var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeesSchema = new Schema({
	employeeId : String,
	//employeeId : Number,
	employeeName : String,
	teams : Array
});

mongoose.model("employees", employeesSchema);

module.exports = mongoose.model("employees");

//module.exports = mongoose.model("employees", employeesSchema);


