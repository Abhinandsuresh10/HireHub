import  redisClient  from "../../config/redis";
import { HttpResponse } from "../../constants/response.message";
import { sendOtpEmail } from "../../utils/mail.util"; 

export class OtpService {
    private static OTP_EXPIRY:number = 300; 

    static async generateOTP(email: string, role: "user" | "recruiter" | "admin") {
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
        const key = `otp:${role}:${email}`;
        console.log(otp);
        
        await redisClient.setEx(key, this.OTP_EXPIRY, otp); 

        await sendOtpEmail(email, otp);

        return { message: HttpResponse.OTP_SENT_SUCCESS };
    }

    static async verifyOTP(email: string, otp: string, role: "user" | "recruiter" | "admin") {
        const key = `otp:${role}:${email}`;
        const storedOtp = await redisClient.get(key);

        if (!storedOtp) {
            throw new Error(HttpResponse.OTP_EXPIRED_OR_IVALID)
        };
        if (storedOtp !== otp) {
            throw new Error(HttpResponse.INCORRECT_OTP)
        };

        await redisClient.del(key); 
        return { message: HttpResponse.OTP_VERIFY_SUCCESS };
    }
}
