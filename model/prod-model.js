let mongoose = require('mongoose');

let prodschema = mongoose.Schema({
    id : Number,
    prod_name : String,
    category : String,
    price : Number,
    image : String
})

let product = mongoose.model('product', prodschema)

module.exports = product;