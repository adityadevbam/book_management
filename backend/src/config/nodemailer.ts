import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send OTP emails
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Keep consistency with environment variables
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`,
        });

        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send OTP email");
    }
};

export default transporter;
