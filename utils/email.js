const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
});

const sendEmail = async (to, subject, content) => {
    try {
        const mailOptions = {
            from: '"JOB-PORTAL" <' + process.env.AUTH_EMAIL+ ">",
            to,
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent : ' + info.response);
    } catch (error) {
        console.log('Error in sending email:', error);
    }
}

module.exports = sendEmail;