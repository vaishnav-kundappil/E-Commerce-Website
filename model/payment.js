
const mongoose=require("mongoose")


const PaySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    prodid:{
        type:String,
        required:true,
    },
    prodname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    count:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
        required:true
    },
    transac_id:{
        type:String,
        required:true,
        unique:true
    }
   
})


const PaymentCollection=new mongoose.model('PaymentCollection',PaySchema)

module.exports=PaymentCollection;