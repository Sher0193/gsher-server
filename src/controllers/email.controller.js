const nodemailer = require('nodemailer');

const config = require ("../../private/config.json");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: config.email,
        pass: config.emailpass,
     },
secure: true,
});

exports.sendMail = (req, res) => {
    const {email, subject, text, name} = req.body;
    const mailData = {
        from: config.email,
        to: config.emaildest,
        subject: subject,
        text: text,
        html: '<br>' + text + '<br/><br>From: ' + name + '</br><b> User gave this email to reply to : ' + email + '</b>',
    };
    
    transporter.sendMail(mailData, (err, info) => {
   if(err) {
     console.log(err)
     res.json({success: false});
   }
   res.status(200).send({ success: true, message: "Mail send", message_id: info.messageId});
});
};
