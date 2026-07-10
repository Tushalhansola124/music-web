const forgotPasswordTemplate = (name, otp) => {

    return `
    
    <h2>Hello ${name}</h2>

    <p>Your password reset OTP is</p>

    <h1>${otp}</h1>

    <p>This OTP expires in 10 minutes.</p>

    <p>If you didn't request this, ignore this email.</p>

    `;

};

module.exports = forgotPasswordTemplate;