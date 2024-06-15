let mongoose = require('mongoose');

let empschema = mongoose.Schema({
    Name : String,
    Designation : String,
    Salary : Number
})

let employee = mongoose.model('employee', empschema)

module.exports = employee;