const mongoose=require("mongoose")
const ContactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    feedback:{
        type:String,
        required:true,
    }
    
})


const ContactCollection=new mongoose.model('ContactCollection',ContactSchema)
module.exports=ContactCollection