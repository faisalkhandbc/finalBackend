const mongoose=require('mongoose')

const table=mongoose.Schema({
    tabelNo:{
        type:Number
    },

    capacity:{
        type:Number
    }


})

module.exports=mongoose.model('table', table)