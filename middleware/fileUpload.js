const path=require('path')
const multer=require('multer')

var storage=multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/')
    },
    filename:function(req, file, cb){
       cb(null, new Date().toISOString()+file.originalname)
    }
});


var upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    }
})

module.exports=upload