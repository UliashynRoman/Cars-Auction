//Chunk 3
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: '411d11ccc6f8f10af27de0e532d9a598-9949a98f-3369c3fe',
        domain: 'sandbox33ca37e20ebd444cbba1b16efa9513ec.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailgun(auth));
//Chunk 4
const sendMail = (email,subject,text,cb) => {

    const mailOptions = {
        from: email,
        to: 'romanuliashyn@gmail.com',
        subject,
        text
    };
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            cb(err,null);
        } else {
            cb(null,data);
        }
    });
}


module.exports = sendMail;
