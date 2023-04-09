const mongoose=require('mongoose')

const customerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true,
        unique:true
    },
}) 

module.exports=mongoose.model('customer', customerSchema)