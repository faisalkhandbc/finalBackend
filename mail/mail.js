require('dotenv').config()
var nodemailer = require('nodemailer');
function sendEmail(to,otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mailtofaisal2@gmail.com',
            pass: '#Grand_khan50@#'
        }
    });
    
    var str = "your otp = ";
    var a =otp;
    str+=a;
    str += "\notp valid till 2min"
    var mailOptions = {
        from: 'mailtofaisal2@gmail.com',
        to: to,
        // cc:cc,
        subject: 'Reset Password OneBite!!',
        text: str,
        html:require('./otpEmailView')({otp:otp})
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = sendEmail