const mongoose=require("mongoose")
const admLogin=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
    
})

const admCollection=new mongoose.model('admCollection',admLogin)
module.exports=admCollection