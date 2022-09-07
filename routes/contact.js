const express = require("express");
const router = express.Router();
// *Useful for getting environment variables
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID;
const emailValidator = require('deep-email-validator');
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT = 'https://developers.google.com/oauthplayground'
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
 
async function isEmailValid(email) {
 return emailValidator.validate(email)
}

router.post('/submit-query', async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    const {valid, reason, validators} = await isEmailValid(email);
    console.log(valid,reason,validators)
    if (!valid) 
    return res.json({
        error: "Invalid",
        success: false
    })


    const accessToken = await oauth2Client.getAccessToken();
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'aryanchourey4@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });
    let mailDetails = {
        from: 'Aryan Chourey <aryanchourey4@gmail.com>',
        to: email,
        subject: 'Thanks for submitting your query',
        html: `<p>Dear ${name},<br><br>Thank you for contacting me. I have received your message and will get back to you within 24 hours. Until then, you can give me a call anytime at +91 9871012686 or email me at aryanchourey4@gmail.com<br><br>Thanks and regards,<br>Aryan Chourey</p>`
    };
    mailTransporter.sendMail(mailDetails, async function (err, data) {
        if (err) {
            console.log(err);      
            return res.json({
                error: err,
                success:false,
            })
        } else {
            console.log('success')            
            return res.json({
                error: null,
                success:true ,
            }),
            mailDetails.to = 'aryanchourey4@gmail.com',
            mailDetails.html = `<p>Hi Aryan!<br><br>You have recieved a message on your website. The details are : <br><br><strong>From : </strong>` + req.body.name + `<br><strong>Email : </strong>` + req.body.email + `<br><strong>Message : </strong>` + req.body.message,
            await mailTransporter.sendMail(mailDetails);
        }
    });


})


module.exports = router;