const nodemailer = require('nodemailer');


const sendEmail = async options => {
    // console.log(process.env)
    // create a transporter  
    // ACTUALLY WE ARE USING A MAILTRAP HOSTING SYSTEM AND ALL HOST AND PORT NAME PASSWORD GIVEN BY THEM   
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD

        }

    })

    // we need to define the email options  
    const mailOptions = {
        from: "Suzan <tsuzanbt@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:options.email,

    }


    // actually send the email  
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
     


}



module.exports = sendEmail;
