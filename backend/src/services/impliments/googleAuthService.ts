import { OAuth2Client } from "google-auth-library";
import { HttpResponse } from "../../constants/response.message";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthService {
    static async verifyGoogleToken(token: string) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error(HttpResponse.INVALID_GOOGLE_TOKEN);
            }

            return {
                name: payload.name,
                email: payload.email,
                isGoogleAuth: true,
            };
        } catch (error) {
            console.error(error);
            throw new Error(HttpResponse.GOOGLE_AUTH_FAIL);
        }
    }
}
