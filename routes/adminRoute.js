var express = require('express')
var router = express.Router()
const adminController =require('../controller/adminController')
const verifyTokenmiddleware = require('../middleware/verifyToken') 

const admin = require('../models/admin')
require('dotenv').config()

const upload=require('../middleware/fileUpload')
router.get('/abc', (req, res) => {
    // console.log(process.env.ABC)
    // console.log(process.env.PQR)
    res.send("hello get abc");
})

// router.post('/addfood',  fileUploadmiddleware.upload.single('file'), adminController.addFood )
// router.post('/editfoodwithimage',  fileUploadmiddleware.upload.single('file'), adminController.editFoodWithImage )

router.get('/check', adminController.Check)
router.post('/register', adminController.register)
router.post('/login', adminController.login)
// router.post('/reset', adminController.Reset)
router.post('/addfood',upload.single('foodimage') , adminController.addFood )
router.get('/food/:foodId',adminController.getFoodById)
router.get('/getallfooditem',adminController.getallFoodItem)
router.post('/editfood',adminController.editFood)
router.post('/editfoodwithimage',  adminController.editFoodWithImage )
router.delete('/deletefood/:id',adminController.deleteFood)
router.get('/getalluser',adminController.getallUser)
router.delete('/blockuser/:id',adminController.block)
router.delete('/unblockuser/:id',adminController.unblock)
router.get('/getallorders',adminController.getallOrders) 
router.post('/updateorderstatus',adminController.updateorderstatus) 
router.delete('/deleteorder/:id',adminController.deleteOrder)
router.get('/getoneorder/:id',adminController.getoneOrder)
router.get('/getoneuser/:id',adminController.getOneuser)
router.get('/getorderhistory/:date',adminController.getorderHistory)
router.post('/updatepaymentstatus',adminController.updatePaymentstatus)
router.get('/getqrcode/:id',adminController.getQrcode) 
router.get('/getallfeedback',adminController.getallFeedback)
router.delete('/deletefeedback/:id',adminController.deleteFeedback)
router.post('/changepassword', adminController.changePassword)

// router.post('/reset', adminController.Reset)
// router.post('/forgotpassword', adminController.forgotpassword)

module.exports = router 