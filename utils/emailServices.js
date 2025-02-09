require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject,
            html,
        };

        console.log("📤 Sending email to:", to);

        await sgMail.send(msg);
        console.log("✅ Email sent successfully to", to);
        return true;
    } catch (error) {
        console.error(
            "❌ Error sending email:",
            error.response ? JSON.stringify(error.response.body, null, 2) : error.message
        );
        return false;
    }
};

module.exports = sendEmail;
