let mongoose = require('mongoose');

let transacschema = mongoose.Schema({
    id : Number,
    prod_name : String,
    category : String,
    price : Number,
    email : String,
    count : Number,
    name : String,
    address : String
})

let transaction = mongoose.model('transaction', transacschema)

module.exports = transaction;