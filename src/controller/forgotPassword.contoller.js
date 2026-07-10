const User = require("../models/user.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const sendOTPEmail = require("../services/email.service"); 

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email });

        // Prevent user enumeration
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists, an OTP has been sent to the registered email.",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const hashedOTP = await bcrypt.hash(otp, 10);

        user.otp = hashedOTP;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        await sendOTPEmail(user.email, otp);

        return res.status(200).json({
            success: true,
            message:
                "If an account exists, an OTP has been sent to the registered email.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
            confirmPassword,
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!user.otp || !user.otpExpire) {
            return res.status(400).json({
                success: false,
                message: "OTP not found.",
            });
        }

        if (user.otpExpire.getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        const isValidOTP = await bcrypt.compare(
            otp,
            user.otp
        );

        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        user.otp = null;
        user.otpExpire = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {forgotPassword,resetPassword};