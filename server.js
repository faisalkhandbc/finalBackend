const express = require('express')
const app = express()
var cors = require('cors')
const helmet = require("helmet");
var bodyParser = require('body-parser')
const multer = require('multer')
require('dotenv').config()
const socket=require('socket.io')
const PORT = process.env.PORT || 3000
const session = require('express-session')




const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
 
const dbase=mongoose.connection
  
dbase.on('error', (err)=>{
    console.log(err)
})

dbase.once('open', ()=>{
    console.log('Database connection established')
})

const adminRoutes = require('./routes/adminRoute')
const userRoutes = require('./routes/userRoute');
const cookieParser = require('cookie-parser');



// image
// app.use('/backend/uploads',express.static('uploads'))
 
// some dependency
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(cookieParser({secret: 'APFDJ, ()JDNF'}))
app.use(session({
  secret: 'APFDJ, ()JDNF',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(cors({origin:'http://localhost:4200'}))

// http://localhost:4200

//secure http
app.use(helmet());

//image google cloud cloud
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
app.use(multerMid.single('file'))



//database connection
// const db = require('./database/db')();

// socket connection
var server = require('http').Server(app);
var io = require('socket.io')(server,
    
    
    {
    cors: {
      origin:'*',
      methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  }
  
  ); 
app.set('io',io);
io.on('connection', socket => {
    console.log("new  sockeet connection...");
    socket.emit("test event","hey ob");
});

// for testing purpose
app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/admin', adminRoutes)
app.use('/customer', userRoutes)


// for debugging 
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

