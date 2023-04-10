const Customer=require('../models/customer')
var Food = require('../models/food')
var Order = require('../models/order')
var Feedback = require('../models/feedback')
// const Customer = require('../models/customer')
const jwt=require('jsonwebtoken')
const bodyParser = require('body-parser')
const feedback = require('../models/feedback')
const stripe=require('stripe')("pk_test_51MXnYLSIr6EVwSJCErBkgpl0pt4BGfIQ25mZtTwDhii0NNvIGE5Qsx05dNBcTnrKKWHNNVhDNziGAZJwpnqH5IIg00Jz09n8oW")




// exports.checkout= async (req, res)=>{
//     // const total=Order.findOne({usercontact:})
//     console.log(req.body)
//     try {
//         console.log(req.body);
//         token = req.body.token
//       const customer = stripe.customers
//         .create({
//           email: "mailtofaisal2@gmail.com",
//           source: token.id
//         })
//         .then((customer) => {
//           console.log(customer);
//           return stripe.charges.create({
//             amount: 1,
//             description: "Test Purchase using express and Node",
//             currency: "INR",
//             customer: customer.id,
//           });
//         })
//         .then((charge) => {
//           console.log(charge);
//             res.json({
//               data:"success"
//           })
//         })
//         .catch((err) => {
//             res.json({
//               data: "failure",
//             });
//         });
//       return true;
//     } catch (error) {
//       return false;
//     }
// }


exports.Check = (req, res, next) => {
    res.json({ msg: "All ok" })
}

exports.register=(req, res, next)=>{
    console.log(req.body)
    let customer=new Customer({
        name:req.body.name,
        contact:req.body.contact,
        table:req.body.table,
        ordertype:req.body.ordertype
    })
    customer.save()
    .then(customer=>{
        let token=jwt.sign({_id:customer._id}, 'APFDJ, ()JDNF', {expiresIn: '1hr'})
        var session = req.session;
        session.token = token;
        console.log(session);

        res.json({
            message:"Customer Added",
            user_id: customer._id,
            token
        })
    }).catch(error=>{
        console.log(error);
        res.json({
            message:"Error Occured"
        })
    })
}

exports.login=(req, res, next)=>{
    var contact=req.body.contact

    Customer.findOne({contact:contact})
    .then(customer=>{
        if(customer){
            let token=jwt.sign({name:customer.name}, 'APFDJ, ()JDNF', {expiresIn: '1hr'})
            res.json({
                message: "Login Successfully", 
                token
            })
        }
        else{
            res.json({
                messgae:"Invalid Contact"
            })
        }
    })
}


exports.getallFoodItem = (req, res) => {
    Food.find((err, items) => {
        if (err) {
            console.log("some error while fethcing food userhome")
            res.status(500).json({ errormsg: 'Somthing went wrong' })
        }
        // console.log(items)
        res.status(200).json( items )
    })
}

exports.changepayment=(req, res)=>{
    console.log(req.body)
    const pay='paid'
    Order.updateOne({ _id: req.body.id }, { $set:{paymentstatus:pay} }, (err, done) => {
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
exports.getfoodBycategory=(req, res)=>{
    Food.find({category:req.params.category}, (err, food)=>{
        if(err){
            res.json("Something went wrong")
        }
        else{
            console.log(food)
            res.json(food)
        }
    })
}

exports.getfoodbyname=(req, res)=>{ 
    console.log(req.body)

    Food.find({foodname:req.body.foodname}, (err, food)=>{
        if(err){
            res.json(err)
        }
        else{
            console.log(food)
            res.json(food)
        }
    })
}

exports.getnonveg=(req, res)=>{
    var category='Non-Veg'

    Food.find({category:category}, (err, food)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(food)
        }
    })
}

exports.getveg=(req, res)=>{
    var category='Veg'

    Food.find({category:category}, (err, food)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(food)
        }
    })
}

exports.getdrinks=(req, res)=>{
    var category='Beverages'

    Food.find({category:category}, (err, food)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(food)
        }
    })
}

exports.getdesserts=(req, res)=>{
    var category='Desserts'

    Food.find({category:category}, (err, food)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(food)
        }
    })
}

exports.getfeedback=(req, res)=>{
    Feedback.find((err, feedback)=>{
        if(err){
            res.json('Something went wrong')
        }
        else{
            res.json(feedback)
        }
    })
}

function decrementQuantity(req, res, id) {
    Food.findOne({ _id: id }, (error, item) => {
        if (error) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        else {
            var avail = true;
            let qty = item.foodqty;
            if (qty - 1 == 0) {
                avail = false;
            }
            Food.updateOne({ _id: id }, {
                foodqty: qty - 1,
                foodavail: avail
            }, function (err, data) {
                if (err) {
                    console.log("something went wrong!!")
                    res.json({ errormsg: "something went wrong!!" });
                }
                else {
                    // **************************************************
                    // const io = req.app.get('io');
                    // io.emit("cart", "item added or removed from cart by user");
                    // **************************************************
                    console.log("edited(decrement) quantity");
                }
            })
        }
    })
}

function intcrementQuantity(req, res, id) {
    Food.findOne({ _id: id }, (error, item) => {
        if (error) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        else {
            let qty = item.foodqty;
            qty += req.body.foodqty;
            Food.updateOne({ _id: id }, {
                foodqty: qty,
                foodavail: true
            }, function (err, data) {
                if (err) {
                    console.log("something went wrong!!")
                    res.json({ errormsg: "something went wrong!!" });
                }
                else {
                    // **************************************************
                    // const io = req.app.get('io');
                    // io.emit("cart", "item added or removed from cart by user");
                    // **************************************************
                    console.log("edited(increment) quantity");
                }
            })
        }
    })
}

function secondtimecart(req, res, oldcart, newitem) {
    var oldavail = false;
    var newtotal = oldcart.total + newitem.foodprice;
    var tot;
    var olditemsjsonarray = oldcart['items']

    for (var i = 0; i < olditemsjsonarray.length; i++) {
        if (olditemsjsonarray[i]._id == newitem._id) {
            oldavail = true;
        }
    }
    if (oldavail) {
        console.log("already in cart");
        for (var i = 0; i < olditemsjsonarray.length; i++) {
            if (olditemsjsonarray[i]._id == newitem._id) {
                olditemsjsonarray[i].foodqty += 1;
                oldcart.total += olditemsjsonarray[i].foodprice
                tot = oldcart.total
            }
        }
        Cart.updateOne({ _id: oldcart._id }, {
            items: olditemsjsonarray,
            total: tot
        }, async function (err, ct) {

            if (err) {
                console.log("Somthing went wrong in add to cart")
                res.json({ errormsg: 'Somthing went wrong' })
            }
            else {

                if (newitem.unlimited) {
                    console.log("unlimited");
                    const io = req.app.get('io');
                    io.emit("cart", "item added or removed from cart by user");
                }
                else {
                    // **************************************************
                    // var x = await decrementQuantity(req, res, newitem._id);
                    // **************************************************
                    const io = req.app.get('io');
                    io.emit("cart", "item added or removed from cart by user");
                    console.log("limited");
                    console.log("item already so incremented done!");
                }
            }
        })
    }
    else {
        console.log("not in cart");
        olditemsjsonarray.push(newitem);
        Cart.updateOne({ _id: oldcart._id }, {
            items: olditemsjsonarray,
            total: newtotal
        }, async function (err, ct) {

            if (err) {
                console.log("Somthing went wrong in add to cart")
                res.json({ errormsg: 'Somthing went wrong' })
            }
            else {
                if (newitem.unlimited) {
                    console.log("unlimited");
                    const io = req.app.get('io');
                    io.emit("cart", "item added or removed from cart by user");
                }
                else {
                    // **************************************************
                    // var x = await decrementQuantity(req, res, newitem._id);
                    // **************************************************
                    const io = req.app.get('io');
                    io.emit("cart", "item added or removed from cart by user");
                    console.log("limited");
                    console.log("new item  so no increment!");
                }
            }
        })
    }
}




async function SaveinOrder(req, res, cart) {
    var today = new Date();
    var date = today.toJSON().slice(0, 10);
    var errormessage = "";
    const allitems = cart.items;

    for (let i = 0; i < allitems.length; i++) {
        const oneitem = allitems[i];
        const oneitemid = oneitem._id;
        const oneitemqty = oneitem.foodqty;
        await Food.findById(oneitemid, (err, orignalitem) => {
            if (err) {
                console.log("something went wrong!!")
                res.json({ errormsg: "something went wrong!!" });
            }
            else {
                if (!orignalitem.unlimited) {
                    const orignalitemqty = orignalitem.foodqty;
                    if (orignalitemqty - oneitemqty < 0) {
                        errormessage += " " + orignalitem.foodname
                    }
                }
                else {
                    if (!orignalitem.foodavail) {

                        errormessage += " " + orignalitem.foodname
                    }
                }
            }
        });
    }
    // console.log(errormessage);
    if (errormessage != "") {
        errormessage += " currently not available";
        res.json({ errormsg: errormessage });
    }
    else {
        for (let i = 0; i < allitems.length; i++) {
            const oneitem = allitems[i];
            const oneitemid = oneitem._id;
            const oneitemqty = oneitem.foodqty;

            await Food.findOne({ _id: oneitemid }, async (err, onefooditem) => {
                if (err) {
                    console.log("something went wrong!!")
                    res.json({ errormsg: "something went wrong!!" });
                }
                if (!onefooditem) {
                    console.log("something went wrong!!")
                    res.json({ errormsg: "something went wrong!!" });
                }
                else {
                    if (!onefooditem.unlimited) {
                        let avail = true;
                        if (onefooditem.foodqty - oneitemqty <= 0) {
                            avail = false;
                        }
                        await Food.updateOne({ _id: oneitemid }, {
                            foodqty: onefooditem.foodqty - oneitemqty,
                            foodavail: avail
                        }, function (err, done) {
                            if (err) {
                                console.log("something went wrong!!")
                                res.json({ errormsg: "something went wrong!!" });
                            }
                            else {
                                console.log("order placed step1");

                            }
                        })
                    }
                }
            })
        }
        User.findOne({ _id: req.userId }, async (error, user) => {
            if (error) {
                console.log("something went wrong!!")
                res.json({ errormsg: "something went wrong!!" });
            }
            else {
                var order = new Order({
                    userid: cart.userid,
                    useremail: cart.useremail,
                    items: cart.items,
                    total: cart.total,
                    orderdate: date,
                    contact: user.contact
                })
                order.save(async (err, a) => {
                    if (err) {
                        console.log("something went wrong!!")
                        res.json({ errormsg: "something went wrong!!" });
                    }
                    else {
                        console.log("order saved in order table");
                        // var y = await Place(req, res)
                    }
                })
                var y = await Place(req, res)
            }
        })

    }
}

async function Place(req, res) {
    await Cart.deleteOne({ userid: req.userId }, (err) => {
        if (err) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
    })
    console.log("order placed so deleted from cart");
    const io = req.app.get('io');
    io.emit("neworderplaced", "New order placed by some user!");
    res.json({ msg: "successfully order placed" });
}



exports.placeOrder = (req, res) => {
    console.log(req.body);


    Customer.findOne({contact:req.body.contact}, (err, customer)=>{
        if(err){
            console.log(err)
        }
        else{
            if(customer){
                console.log("Yes", customer)
                const order=new Order({
                    username:customer.name,
                    usercontact: customer.contact,
                    items:req.body.items,
                    foodname:req.body.foodname, 
                    total:req.body.total,
                    table:req.body.table,
                    ordertype: req.body.ordertype
                })
                order.save(async (err,order)=>{
                    if(err){
                        console.log(err);
                    }else{
                        let token=jwt.sign({_id:customer._id}, 'APFDJ, ()JDNF', {expiresIn: '1hr'})
                        req.session.token = token;
                        await req.session.save();
                        console.log(req.session)
                        console.log(order)
                        res.json({order,contact:req.body.contact});
                    }
                })
            }else{
                const customer = new Customer({
                    name:req.body.name,
                    contact: req.body.contact
                })
                customer.save((err,customer)=>{
                    if (err){
                        console.log(err);
                    }else{
                        const order = new Order({
                    username:customer.name,
                    usercontact: customer.contact,
                    items:req.body.items,
                    total:req.body.total,
                    table:req.body.table,
                    ordertype: req.body.ordertype
                        }
                            
                        )
                        order.save(async (err,order)=>{
                            if(err){
                                console.log(err)
                            }else{
                                
                        let token=jwt.sign({_id:customer._id}, 'APFDJ, ()JDNF', {expiresIn: '1hr'})
                        req.session.token = token;
                        await req.session.save();
                        console.log(req.session)
                        console.log(order)
                        res.json({order,contact:req.body.contact});
                            }
                        })
                    }
                })
            }
        }
    })
}


exports.getAllUserOrders = (req, res) => {
    // status: { $ne: "completed" },

    // console.log(req.params.contact,"GETALL ");
    Order.find({usercontact: req.params.contact}, (err, orders) => {
        if (err) {
            console.log("error in get all order userside");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            orders = orders.reverse()
            res.json(orders);
        }
    })
}

exports.getAllUserOrders2 = (req, res) => {
    var today = new Date();
    var date = today.toJSON().slice(0, 10);
    // status: { $ne: "completed" },
    Order.find({ orderdate: date, userid: req.userId }, async (err, orders) => {
        if (err) {
            console.log("something went wrong!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        orders = orders.reverse()
        res.send(orders);
    })
}

exports.getoneOrder = (req, res) => {
    var id = req.params.id
    Order.find({ _id: id }, (err, order) => {
        if (err) {
            console.log("error in get one order by admin");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        return res.send(order);
    })
}

exports.sendFeedback = (req, res) => {
    var today = new Date();
    var date = today.toJSON().slice(0, 10);
    var fb = new Feedback({
        name: req.body.name,
        contact:req.body.contact,
        feedback: req.body.feedback,
        date: date
    })
    fb.save(async (error, a) => {
        if (error) {
            console.log("something went wrong while sending feedback!!")
            res.json({ errormsg: "something went wrong!!" });
        }
        else {
            console.log("successfully send your feedback");
            res.json({ msg: "successfully send your feedback" });
        }
    })
}


exports.qrCode = (req, res) => {
    var id = req.body.id
    Order.findOne({ _id: id }, (err, order) => {
        if (err) {
            console.log("error while scanning qr code of by user");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        if (order.paymentstatus == "paid") {
            if (order.status == "completed") {
                Order.updateOne({ _id: req.body.id }, { status: "picked up" }, (err, done) => {
                    if (err) {
                        console.log("error while scanning qr code and updating status of by user");
                        return res.json({ errormsg: 'Somthing went wrong' });
                    }
                    else {
                        console.log("order status is updated with qr code");
                        const io = req.app.get('io');
                        io.emit(req.body.email, "order status updated");
                        io.emit("orderdelete", "order status updated");
                        res.json({ msg: "successfully order confirmation done" });
                    }
                })
            }
            else {
                console.log("your order is preparing");
                return res.json({ errormsg: 'your order is preparing' });
            }
        }
        else {
            console.log("your payment status must be paid");
            return res.json({ errormsg: 'you need to pay first' });
        }
    })
}



exports.paymentDone = (req, res) => {
    Order.updateOne({ _id: req.body.id }, { paymentstatus: "paid" }, (err, done) => {
        if (err) {
            console.log("error in paytm gateway by user");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("order payment status updated by paytm gateway");
            const io = req.app.get('io');
            io.emit(req.body.email, "payment status updated");
            io.emit("orderdelete", "payment status updated");
            res.json({ msg: "successfully updated payment status!" });
        }
    })
}

exports.paymentDoneWeb = (req, res) => {
    Order.updateOne({ _id: req.body.id }, { paymentstatus: "paid" }, (err, done) => {
        if (err) {
            console.log("error in paytm gateway by user");
            return res.json({ errormsg: 'Somthing went wrong' });
        }
        else {
            console.log("order payment status updated by paytm gateway");
            const io = req.app.get('io');
            io.emit(req.body.email, "payment status updated");
            io.emit("orderdelete", "payment status updated");
            res.json({ msg: "successfully updated payment status!" });
        }
    })
}