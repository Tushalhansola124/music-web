require("dotenv").config();

const sendEmail = require("./src/services/email.service");

const forgotPasswordTemplate = require("./src/templates/forgotPassword.template");

(async () => {

    await sendEmail({
        to: "patan53890@asitrai.com",
        subject: "Testing Email",
        html: forgotPasswordTemplate("Tushal", "Tushal@123456"),
    });

})();