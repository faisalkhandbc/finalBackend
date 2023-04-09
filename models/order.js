var mongoose = require('mongoose')
var orderSchema = mongoose.Schema({
    username:{ 
        type:String,
    },
    usercontact:{ 
type:String
    },
    items: {
        type: Array,
        default: []
    },
    foodname:{
        type:String
    },
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "placed"
    },
    paymentstatus: {
        type: String,
        default: "unpaid"
    },
    ordertype:{
        type:String
    },
    table:{
        type:Number
    },
    orderdate: { type: Date, default: Date.now }
})
module.exports = mongoose.model('order', orderSchema)

