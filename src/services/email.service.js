const transporter = require("../config/mail.config");

const sendEmail = async ({
    to,
    subject,
    html,
}) => {

    try {

        const info = await transporter.sendMail({
            from: `"Music App" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log("Email Sent");
        console.log(info.messageId);

        return info;

    } catch (error) {

        console.error(error);

        throw error;
    }

};

module.exports = sendEmail;