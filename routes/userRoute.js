var express = require('express')
var router = express.Router()
const userController = require('../controller/userController')
const verifyTokenmiddleware = require('../middleware/verifyToken')  
require('dotenv').config()
const Razorpay=require('razorpay')

var razorpay = new Razorpay({
    key_id: 'rzp_test_8aIMIIRMvtXPDh',
    key_secret: 'V0AKL678W2b39pilMjWvpCgT',
  });

  router.post("/verification", (req, res) => {
    const secret = "razorpaysecret";
  
    console.log(req.body);
  
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
  
    console.log(digest, req.headers["x-razorpay-signature"]);
  
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.status(200).json({
        message: "OK",
      });
    } else {
      res.status(403).json({ message: "Invalid" });
    }
  });

  router.post("/razorpay", async (req, res) => {
    const payment_capture = 1;
    const amount =req.body.amount*100;
    const currency = "INR";
  
    const options = {
      amount,
      currency,
      payment_capture,
    };
  
    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
    }
  }); 
router.get('/check', userController.Check)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getallfooditem',userController.getallFoodItem)
router.get('/getfoodbycategory/:category', userController.getfoodBycategory)
router.post('/getfoodbyname', userController.getfoodbyname)
router.get('/getnonveg', userController.getnonveg)
router.get('/getveg', userController.getveg)
router.get('/getdrinks', userController.getdrinks)
router.get('/getdessert', userController.getdesserts)
// router.post('/addtocart', userController.addtoCart)
// router.get('/getcount',userController.getCount)
// router.get('/getcart',userController.getCart)
// router.post('/deletefromcart', userController.deleteFromCart)
router.post('/placeorder', userController.placeOrder)
router.get('/getalluserorders/:contact', userController.getAllUserOrders)
router.get('/getalluserorders2', userController.getAllUserOrders2)
router.get('/getoneorder/:id',userController.getoneOrder)
router.post('/sendfeedback', userController.sendFeedback)
router.get('/getfeedback', userController.getfeedback)
router.post('/updatepayment', userController.changepayment)
router.post('/qrcode', userController.qrCode)
// router.post('/paymentdone', userController.paymentDone)
// router.post('/paymentdoneweb',userController.paymentDoneWeb)
// router.post('/checkout', userController.checkout)
// aa
module.exports = router