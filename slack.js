var models= require('./models');
var mongoose = require('mongoose');
var express = require('express');
//var express_res_status = require('express-res-status'); 
var app = express();
var async = require('async');

var employees = models[0], teams = models[1], tasks = models[2];

mongoose.connect("mongodb://localhost:27017/mySlack");

//app.use(express_res_status);
app.use(express.json());
app.listen(3000, function(){
    console.log("Listening");
});

app.get('/getTeams', (req,resp) => {
    var employeeID = req.query.id;
    //teamList(employeeID);
    //console.log(employeeID);
    employees.find({employeeID:employeeID},{_id:0},function(err, result){
        var res = result[0];
        var arr = [];
        //console.log(res.employeeName);
        //console.log("Teams-")
        async.each(res.teams, function (id, callback) {
            teams.find({teamID:id}, {_id:0}, function(err, result){
                //console.log(resp);
                //console.log(result);
                arr.push(result[0]);
                callback();
            })}, function(){
                resp.send(arr);
        });
    
    }); 
});

app.post('/getEmployeeNames', (req,resp) => {
    var employeeList = req.body.employees;
    //console.log(employeeList);  
    employees.find({employeeID:{$in:employeeList}},{_id:0, employeeID:1, employeeName:1},function(err, result){
        //console.log(result);
        resp.send(result);    
    }); 
});

/* app.get('/addEmployee', (req,resp) => {
    var employeeID = req.query.employeeID;
    var teamID = req.query.teamID;
    var mode = req.query.mode; 
    
    employees.update({employeeID:{$eq:employeeID}},{$addToSet:{teams:teamID}},{},function(err, result){
        //console.log(result);
        if (err){
            //resp.internalServerError("{message: Failed to add employee}");
            resp.status(500).send("{message: Failed to add employee}");
        }
        var setter = {};
        setter[mode] = employeeID;
        teams.update({teamID:{$eq:teamID}}, {$addToSet:setter},{}, function(err, result){
            //console.log(result);
            if (err){
                resp.send("{message: Failed to add employee}");
            }
            resp.status(200).send("{message: \"Employee added successfully \"}");
        });
            
    }); 
    
}); */

app.post('/add/changeTeam', (req,resp) => {
    var employeeList = req.body.employeeList;
    var teamID = req.bodyquery.teamID;
    var error;
    //var mode = req.query.mode; 
    async.each(employeeList, function(employee, callback){
        var employeeID = employee[id];
        var role = employee[role];
        employees.update({employeeID:{$eq:employeeID}},{$addToSet:{teams:teamID}},{},function(err, result){
            //console.log(result);
            if (err){
                error = true;
            }
            var setter = {};
            setter[role] = employeeID;
            teams.update({teamID:{$eq:teamID}}, {$addToSet:setter},{}, function(err, result){
                //console.log(result);
                if (err){
                    error = true;
                }
                //resp.status(200).send("{message: \"Employee added successfully \"}");
            });
                
        }), 
        function(){
            if (error){
                resp.status(500).send("{message: \"Couldn't add employees \"}");
                return;
            }
            resp.status(200).send("{message: \"Employees added successfully \"}");
        }
    });
});

app.post('/remove/changeTeam', (req,resp) => {
    var employeeList = req.body.employeeList;
    var teamID = req.body.teamID;
    var error;
    //var mode = req.query.mode; 
    async.each(employeeList, function(employee, callback){
        var employeeID = employee[id];
        var role = employee[role];
        employees.update({employeeID:{$eq:employeeID}},{$pull:{teams:teamID}},{},function(err, result){
            //console.log(result);
            if (err){
                error = true;
            }
            var setter = {};
            setter[role] = employeeID;
            teams.update({teamID:{$eq:teamID}}, {$pull:setter},{}, function(err, result){
                //console.log(result);
                if (err){
                    error = true;
                }
                //resp.status(200).send("{message: \"Employee added successfully \"}");
            });
                
        }), 
        function(){
            if (error){
                resp.status(500).send("{message: \"Couldn't add employees \"}");
                return;
            }
            resp.status(200).send("{message: \"Employees added successfully \"}");
        }
    });
});

app.post('/createTeam', (req,resp) => {   
    var team = teams(req.body); 
    team.save(function(err, result){
        if (err) {
            console.log(err);
            resp.status(500).send("{\"message\": \"Couldn't create team \"}");
        }
        else resp.status(200).send("{message: \"Team created successfully \"}");
    });
});

app.get('/deleteTeam', (req,resp) => {
    var teamID = req.query.teamID;
    
    teams.remove({teamID:teamID}, function(err, result){
        if (err) resp.status(500).send("{\"message\": \"Couldn't delete team \"}");
        else resp.status(200).send("{message: \"Team deleted successfully \"}");
    });
});

app.post('/archiveTask', (req,resp) => {
    var _id = mongoose.Types.ObjectId(req.body._id);    
    var archivedBy = req.body.archivedBy;
    var rating = req.body.rating; 
    
    console.log(taskID);
    console.log(archivedBy +" " +  rating);

    tasks.update({_id:{$eq:_id}} ,
        {$set:{archived:true, archivedBy:archivedBy, rating:rating}},
        {},
        function(err, result){
            //console.log(result);
            if (err){
                //resp.internalServerError("{message: Failed to add employee}");
                resp.status(500).send("{message: Failed to archive task}");
                return;
            }      
            console.log(result);
            resp.status(200).send("{message: \"Task archived successfully \"}");     
    });     
});

app.post('/updateTask', (req,resp) => {
    var _id = mongoose.Types.ObjectId(req.body._id);
    var taskDescription = req.body.taskDescription;
    //var mode = req.query.mode; 
    
    tasks.update(
        {_id:_id},{$set:{taskDescription:taskDescription}, $addToSet:{taskHistory:taskDescription}},
        {},
        function(err, result){
            //console.log(result);
            if (err){
                //resp.internalServerError("{message: Failed to add employee}");
                resp.status(500).send("{\"message\": Failed to update task}");
                return;
            }      
            console.log(result);
            resp.status(200).send("{\"message\": \"Task updated successfully \"}");     
    });     
});

app.post('/addTask', (req,resp) => {
    console.log(req.body);
    /* tasks.create(req.body,function(err, result){
        if(err){
            console.log(err);
            resp.status(500).send("{message: \"Failed to add task\"}");
            return;
        }
        console.log(result);
        resp.status(200).send("{message: \"Task added successfully \"}");
    });    */
    var task = new tasks(req.body);
    task.save(function(err){
        if(err){
            console.log(err);
            resp.status(500).send("{message: \"Failed to add task\"}");
        }
        else resp.status(200).send("{message: \"Task added successfully \"}");
    });
});

app.post("/getTasks", (req, resp) => {
    var employeeList = req.body.resources;
    //console.log(employeeList);
    var teamID = req.body.teamID;
    //console.log(teamID);
    var res = []
    async.each(employeeList, function(employeeID, callback){
        //console.log("Fetching details for employee " + employeeID);
        tasks.find({employeeID:employeeID, teamID:teamID, archived:"false"}, function(err, result){
            //console.log(result);
            //res.concat(result);
            res.push.apply(res, result);
            //console.log(result);
            callback();
            
        });
    }, function(){
        //console.log("Sending results");
        resp.send(res);
    });
});

app.get("/getTaskHistory", (req, resp) => {
    var _id = req.query._id;
    //console.log(employeeList);
    //var teamID = req.body.teamID;
    //console.log(teamID);
    //var res = []
    tasks.find({_id:_id},{taskHistory:1}, function(err, result){
        console.log(result);
        resp.status(200).send(result);        
    });
});

var teamList = function(employeeID){
    console.log("Employee ID is " + employeeID);
    employees.find({employeeID:employeeID},{_id:0},function(err, result){
        var res = result[0];
        var res2 = [];
        console.log(res);
        //console.log("Teams-")
        /* res.teams.forEach(id => {
            console.log(id);
            teams.find({teamID:id}, {_id:0}, function(err, result){
                //console.log(result);
                res2.push(result[0]);
                //print(res2);
                
                            });
        });  */   
        /* for (var i =0, j = res.teams.length; i<j; i++){
            id = res.teams[i];
            console.log(id);
            teams.find({teamID:id}, {_id:0}, function(err, result){
                //console.log(result);
                res2.push(result[0]);
                //print(res2);
                
            });
            console.log(res2);
        }
        console.log(res2); */
    });
};

var func = function(id2){teams.find({teamID:id2}, {_id:0}, function(err, result){
    console.log(result);
    //res2.push(result[0]);
    //print(res2);
});}

//func(1);

//teamList(1);
//teamList("1");