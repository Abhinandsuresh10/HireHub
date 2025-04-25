export interface IOtpService {
    generateOTP(email: string, role: "user" | "recruiter" | "admin"): Promise<{ message: string }>;
    verifyOTP(email: string, otp: string, role: "user" | "recruiter" | "admin"): Promise<{ message: string }>;
}
