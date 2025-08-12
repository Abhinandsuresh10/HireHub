import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"HireHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}

interface RejectionEmail {
    email: string;
    name: string;
    jobRole: string;
    reason: string;
}

export const sendCancellationEmail = async ({ email, name, jobRole, reason }: RejectionEmail) => {
   const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from:  `"HireHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your application for ${jobRole} has been cancelled`,
        text: `Hi ${name},\n\nYour application for the role of "${jobRole}" has been cancelled by the recruiter.\n\nReason: ${reason}\n\nRegards,\nHireBub Team`,
    }
    
    await transporter.sendMail(mailOptions);
}