// require('dotenv').config()
// const mongoose = require('mongoose')
// function connectDb() {

//     // mongoose.Promise = global.Promise
//     // // mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//     // mongoose.connect('mongodb://localhost:27017/OneBite', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//     // const con = mongoose.connection
//     // con.on('open', () => {
//     //     console.log("database connected in mongo atlas (#cloud)");
//     // })
//     // con.on('error', err => {
//     //     console.log("Error! while connecting database (INTERNET ERROR)");
//     // });
//     mongoose.connect('mongodb://localhost:27017/OneBite', {useNewUrlParser:true, useUnifiedTopology:true})
// const db=mongoose.connection

// db.on('error', (err)=>{
//     console.log(err)
// })

// db.once('open', ()=>{
//     console.log("Database Connection Established Successfully")
// })
// }

// module.exports = connectDb