const nodemailer = require("nodemailer");

const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTPHOST,
            port: process.env.SMTPPORT,
            secure: false,
            auth: {
                user: process.env.SMTPLOGIN,
                pass: process.env.SMTPPASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTPFROM,
            to: email,
            subject: subject,
            // text: text,
            html: `<div>Click on <a href=${text}>this url</a></div>`,
        });
    }
    catch (err) {
        console.log("Failed to send email - " + err);
    }
}

module.exports = sendEmail