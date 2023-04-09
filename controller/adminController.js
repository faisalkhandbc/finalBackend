require('dotenv').config()
const path=require('path')
var Food = require('../models/food')
const Admin=require('../models/admin')
var Order = require('../models/order')
var Feedback = require('../models/feedback')
var Customer=require('../models/customer')
var QRCode = require('qrcode')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {fileUpload}=require('../middleware/fileUpload')
const Otp=require('../models/otp')
const moment = require("moment");
const admin = require('../models/admin')

exports.Check = (req, res, next) => {
    res.json({ msg: "All ok" })
}


exports.register=(req, res, next)=>{

    console.log(req.body)

    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json(
                err
            )
        }  

        let admin=new Admin({
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password:hashedPass
        })
        admin.save()
        .then(admin=>{
            res.json(
            "User Added"
            )
        })
        .catch(error=>{
            res.json(
                {error:"Email Already Exist"}
            )
        })
    })
}


exports.login=(req, res, next)=>{
    console.log(req.body);

    Admin.findOne({email:req.body.email}, (err, admin)=>{
        if(err){
            console.log(err)
        }
        else{
            if(!admin){
                res.json({error:"Invalid Email"})
            }
            else{
                bcrypt.compare(req.body.password, admin.password).then(match=>{
                    if(match){
                        console.log("Login Successfull")
                        let payload = { subject: admin._id, email: admin.email }
                        let token = jwt.sign(payload, 'APFDJ, ()JDNF', {
                            expiresIn: "24h"
                        })
                        res.json({ token: token})
                    }
                    else{
                        console.log('Incorrect Password')
                        res.json({error:"Incorrect Password"})
                    }
                }).catch(err=>{
                    res.json({
                        error:"Something went wrong"
                    })
                })
            }
        }
    })
}
function getEmail(email) {
    Otp.find({ email: email }, (err, otps) => {

        if (err) {
            console.log("err in finding email ");
        }
        if (otps.length != 0) {
            console.log("yes in delete");
            Otp.deleteOne({ email: email }, (err) => {
                if (err)
                    console.log("err in delete");
            }
            )
        }
    })
}

// exports.Reset = (req, res) => {
//     console.log(req.body)
//     Admin.findOne({ email: req.body.email }, async (err, admins) => {

//         if (err) {
//             console.log("err in finding email ");
//             res.json({ msg: "some error!" });
//         }
//         if (admins.length == 0) {
//             console.log("Admin does not exist with this email at forgot password!!");
//             res.json({ msg: "Admin does not exist with this email" });
//         }
//         else {
//             Otp.findOne({ email: req.body.email }, async (err, otp) => {
//                 if (err) {
//                     console.log("err in finding email ");
//                     res.json({ msg: "some error!" });
//                 }
//                 if (otp) {
//                     console.log(otp.otp);
//                     sendMail(req.body.email, otp.otp);
//                     setTimeout(async function () {
//                         console.log("timeout (2min)");
//                         var y = await getEmail(req.body.email)
//                     }, 2 * 60000);
//                     res.status(201).json({ message: "all ok otp has been send" });
//                 }
//                 else {
//                     var email = req.body.email
//                     var x = await getEmail(req.body.email)
//                     setTimeout(async function () {
//                         console.log("timeout (2min)");
//                         var y = await getEmail(email)
//                     }, 2 * 60000);
//                     var a = Math.floor(1000 + Math.random() * 9000);
//                     var otp = new Otp({
//                         otp: a,
//                         email: req.body.email
//                     });
//                     // console.log("otp =", otp);
//                     try {
//                         doc = otp.save();
//                         sendMail(otp.email, otp.otp);
//                         res.status(201).json({ message: "all ok otp has been send" });
//                     }
//                     catch (err) {
//                         res.json({ msg: "some error!" });
//                     }
//                 }
//             })

//         }
//     })
// }


// exports.resestPasswordDone = (req, res) => {
//     Admin.findOne({ email: req.body.email }, async (err, admin) => {
//         if (err) {
//             console.log(err)
//             res.json({ msg: "Somthing went wrong" });
//         }
//         else {
//             if (!admin) {
//                 res.json({ msg: 'User does not exist with this email!!' })
//             }
//             else {
//                 Otp.findOne({ email: req.body.email }, async (err, otps) => {

//                     if (err) {
//                         res.json({ msg: "Somthing went wrong" });
//                     }
//                     if (!otps) {
//                         res.json({ msg: "Otp has been expired!" });
//                     }
//                     else {
//                         var otp = otps.otp;
//                         if (otp != req.body.otp) {
//                             res.json({ msg: "Invalid Otp!!!" });
//                         }
//                         else {
//                             var p = Admin.hashPassword(req.body.p1)
//                             var x = await getEmail(req.body.email)
//                             Admin.updateOne({ email: req.body.email },
//                                 { password: p }, function (err, user) {
//                                     console.log(1);
//                                     if (err) {
//                                         console.log(err)
//                                         res.json({ msg: "Somthing went wrong" });
//                                     }
//                                     else {
//                                         res.json({ message: "password updated!!" });
//                                     }
//                                 });
//                         }
//                     }
//                 })


//             }
//         }
//     })
// }


exports.changePassword = (req, res) => {

    console.log(req.body)

    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        console.log(hashedPass,err)
        Admin.updateOne({email:req.body.email}, {$set:{
            password:hashedPass
        }}, (err, result)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("Password Changed")
                res.json("password changed") 
            }
        })
    })

   
    // User.findOne({ email: req.body.email }, (err, user) => {
    //     if (err) {
    //         res.json({ msg: "Somthing went wrong" });
    //     }
    //     else {
    //         if (!user) {
    //             res.json({ msg: "Somthing went wrong" });
    //         }
    //         else {
    //             bcrypt.compare(req.body.old, user.password).then(match => {
    //                 if (match) {
    //                     console.log("correct old password");
    //                     // console.log(req.body.p1);
    //                     var p = User.hashPassword(req.body.p1)
    //                     User.updateOne({ email: req.email },
    //                         { password: p }, function (err, user) {
    //                             if (err) {
    //                                 res.json({ msg: "Somthing went wrong" });
    //                             }
    //                             else {
    //                                 console.log("password changed!");
    //                                 res.status(200).json({ msg: "changed password" })
    //                             }
    //                         })
    //                 }
    //                 else {
    //                     console.log("incoreect passss");
    //                     res.json({ msg: 'Incorrect old password!!' })
    //                 }
    //             }).catch(err => {
    //                 res.json({ msg: 'Somthing went wrong' })
    //             })
    //         }
    //     }
    // })
}




// exports.addFood = async (req, res) => {
//     // var file = req.file
//     let avail;
//     let qty;
//     let limit;
//     if (!isNaN(req.body.foodqty)) {

//         if (req.body.foodqty <= 0) {
//             avail = false;
//             qty = 0;
//             limit = false;
//         }
//         else {
//             avail = true;
//             qty = req.body.foodqty;
//             limit = false;
//         }


//         if (req.body.foodqty == -1) {
//             avail = true;
//             qty = -1;
//             limit = true;
//         }
//         // **********************
//         try {
//             const image = req.file
//             const imageUrl = fileUpload.upload('foodimage')
//             var food = new Food({
//                 foodname: req.body.foodname,
//                 foodqty: qty,
//                 foodprice: req.body.foodprice,
//                 // foodimage: file.filename,
//                 foodimage: imageUrl,
//                 foodavail: avail,
//                 unlimited: limit
//             })
//             try {
//                 doc = food.save();
//                 console.log("food added by admin");
//                 const io = req.app.get('io');
//                 io.emit("foodcrudbyadmin", " food crud operation done by admin!");
//                 return res.json({ msg: 'Food added' });
//             }
//             catch (err) {
//                 console.log("some error while adding food by admin")
//                 return res.json({ errormsg: 'Somthing went wrong' });
//             }
//         }
//         catch (err) {
//             console.log("some error while adding food by admin")
//             return res.json({ errormsg: 'Somthing went wrong' });
//         }
//         // **********************

//     }
//     else {
//         console.log("Invalid Quantity!");
//         return res.json({ errormsg: 'Invalid Quantity!' });
//     }
// }

exports.addFood=(req, res, next)=>{
    // const image = req.file
    // const imageUrl = fileUpload.upload('foodimage')
    console.log(req.body)
    var food=new Food({
        foodname:req.body.foodname,
        foodprice:req.body.foodprice,
        foodimage:req.body.foodimage,
        category:req.body.category,
        description:req.body.description,
    })
    // console.log(req.body, "From Add Food")
    // console.log(req.file)
    // if(req.file){
    //     food.foodimage=req.file.path
    // }
    food.save()
    .then(food=>{
        const io = req.app.get('io');
        io.emit("foodcrudbyadmin", " food crud operation done by admin!");
        res.json({
            message:"Food Added"
        })
    }).catch(error=>{
        res.json({
            message:"Failed to Add Food"
        })
    })
}

exports.getFoodById = (req,res)=>{
    console.log(req.params.foodId);
    Food.findById(req.params.foodId).exec((err,food)=>{
        if(err){
            console.log(err);
        }else{
            console.log(food);
            res.json(food);
        }
    })
}

exports.getallFoodItem = (req, res) => {

    Food.find({}, (err, items) => {
        if (err) {
            console.log("some error while fetching all food by admin")
            res.status(500).json({ errormsg: 'Somthing went wrong' })
        }
        res.json(items)
    })
}


exports.editFood = (req, res) => {
    console.log(req.body,"FOOOOOOOOOOOOOOD")

    Food.findById(req.body._id, (err,food)=>{
        if(err){
            console.log(err)
                res.json(err)
             
        }
        else {
                
            Food.updateOne({_id:food._id},{"$set":req.body},{new:true},(err,food)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(food);
                    res.json(food);
                }
            })

        console.log(food)
        }
    })
}

exports.editFoodWithImage = async (req, res) => {
    let avail;
    let qty;
    if (!isNaN(req.body.foodqty)) {
        if (req.body.foodqty <= 0) {
            avail = false;
            qty = 0;
        }
        else {
            avail = true;
            qty = req.body.foodqty;
        }
        if (req.body.foodqty == -1) {
            // avail = true;
            qty = -1;
            if (req.body.isitavail == "yes") {
                avail = true;
            }
            else {
                avail = false;
            }
        }
        try {
            Food.findOne({ _id: req.body._id }, async (err, data) => {
                if (err) {
                    console.log("error in delete food by admin");
                    return res.json({ errormsg: 'Somthing went wrong' });
                }
                else {
                    if (!data) {
                        console.log("error in delete food by admin");
                        return res.json({ errormsg: 'Somthing went wrong' });
                    }
                    else {
                        try {
                            var x = await fileUpload.deleteImage(data.foodimage);
                            const image = req.file
                            const imageUrl = await fileUpload.uploadImage(image)
                            Food.updateOne({ _id: req.body._id }, {
                                foodname: req.body.foodname,
                                foodprice: req.body.foodprice,
                                foodqty: req.body.foodqty,
                                // foodimage: file.filename,
                                foodimage: req.body.foodimage,
                                foodavail: avail
                            }, function (err, item) {
                                if (err) {
                                    console.log("some error in edit food with image")
                                    return res.json({ errormsg: 'Somthing went wrong' });
                                }
                                else {
                                    console.log("Edited food with image");
                                    const io = req.app.get('io');
                                    io.emit("foodcrudbyadmin", " food crud operation done by admin!");
                                    return res.json({ msg: 'Edited food with image' });
                                }
                            })
                        } catch (error) {
                            console.log("error in delete food by admin");
                            return res.json({ errormsg: 'Somthing went wrong' });
                        }

                    }

                }

            })
        }
        catch (err) {
            console.log("some error while editing  food with image by admin")
            return res.json({ errormsg: 'Somthing went wrong' });
        }

    }
    else {
        console.log("Invalid Quantity!");
        return res.json({ errormsg: 'Invalid Quantity!' });
    }


}

exports.deleteFood = (req, res) => {
    // console.log(req.body)

    Food.deleteOne({ _id: req.params.id }, (error) => {
        if (error) {
            console.log("error in delete Food by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
    })
    return res.json({ msg: 'successfully feedback deleted' });
}

exports.getallUser = (req, res) => {
    Customer.find((err, usr) => {
        if (err) {
            console.log("error in get all user by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            res.json( usr );
        }
    })
}


exports.block = (req, res) => {
    var id = req.params.id
    User.updateOne({ _id: id }, { blocked: true }, (err, user) => {
        if (err) {
            console.log("error in block user by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("blocked user");
            res.status(201).json({ msg: "blocked user!" });
        }
    })

}
exports.unblock = (req, res) => {
    var id = req.params.id
    User.updateOne({ _id: id }, { blocked: false }, (err, user) => {
        if (err) {
            console.log("error in unblock user by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("unblocked user");
            res.status(201).json({ msg: "unblocked user!" });
        }
    })
}



exports.getallOrders = (req, res) => {
    var today = new Date();
    var date = today.toJSON().slice(0, 10);
    // unpaid
    // picked up
    // Order.find({ $or: [{ status: { $ne: "picked up" } }, { paymentstatus: "unpaid" }], orderdate: date }, (err, orders) => {
    //     if (err) {
    //         console.log("error in get all order by admin");
    //         return res.json({ errormsg: 'Somthing went wrong' });
    //     }
    //     else {
    //         console.log(orders);
    //         res.json( orders );
    //     }
    // }).select("-items").select("-orderdate")

    Order.find((err, order)=>{
        if(err){
            console.log(err)
        }
        else{
            res.json(order)
        }
    })
}



exports.updateorderstatus = (req, res) => {
    console.log(req.body);
    Order.updateOne({ _id: req.body.id }, { status: req.body.status }, (err, done) => {
        if (err) {
            console.log(err)
            console.log("error in update status of order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("order status updated");
            const io = req.app.get('io');
            io.emit(req.body.contact, "order status updated");
            res.json({ msg: "successfully updated order status!" });
        }
    })
}



exports.deleteOrder = (req, res) => {
    Order.deleteOne({ _id: req.params.id }, (error) => {
        if (error) {
            console.log("error in delete order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
    })
    const io = req.app.get('io');
    io.emit("orderdelete", "order deleted by admin!");
    return res.json({ msg: 'food deleted by admin' });
}




exports.getoneOrder = (req, res) => {
    var id = req.params.id
    console.log(req.params)
    Order.find({ _id: id }, (err, order) => {
        if (err) {
            console.log("error in get one order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        console.log(order)
        return res.send(order);
    })
}


exports.getOneuser = (req, res) => {
    var id = req.params.id
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            console.log("error in get one user by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        res.status(200).json( user )
    }).select("-_id")
}


exports.getorderHistory = (req, res) => {
    console.log(req.params.date)
    
    Order.find({orderdate:
        {
            $gte: moment(req.params.date).startOf("day").toDate(),
            $lt: moment(req.params.date).endOf("day").toDate()
        }
    },(err, order)=>{
        if(err){
            console.log(err)
        }
        else{
            if(order){
                console.log(order)
                order=order.reverse()
                res.json(order)
            }
        }
    })
}


exports.updatePaymentstatus = (req, res) => {
    Order.updateOne({ _id: req.body.id }, { paymentstatus: req.body.paymentstatus }, (err, done) => {
        if (err) {
            console.log("error in update payment status of order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("order  payment status updated");
            const io = req.app.get('io');
            io.emit(req.body.email, "order status updated");
            res.json({ msg: "successfully updated order payment status!" });
        }
    })
}


exports.getQrcode = (req, res) => {
    var id = req.params.id
    Order.findOne({ _id: id }, (err, order) => {
        if (err) {
            console.log("error while generating qr code of order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        if (order.status == "completed" || order.status == "picked up") {
            QRCode.toDataURL(id).then(url => {
                res.json(url );
            }).catch(err => {
                console.log("error while generating qr code of order by admin");
                return res.json({ errormsg: 'error while generating qr code' });
            })
        }
        else {
            console.log("order status must be completed or pickup for getting QR code");
            return res.json({ errormsg: 'error while generating qr code' });
        }
    })
}



exports.getallFeedback = (req, res) => {
    Feedback.find({}, (err, feedbacks) => {
        if (err) {
            console.log("error in get all feedback by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            feedbacks = feedbacks.reverse() 
            res.json(feedbacks );
        }
    })
}


exports.deleteFeedback = (req, res) => {
    Feedback.deleteOne({ _id: req.params.id }, (error) => {
        if (error) {
            console.log("error in delete feedback by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
    })
    return res.json({ msg: 'successfully feedback deleted' });
}