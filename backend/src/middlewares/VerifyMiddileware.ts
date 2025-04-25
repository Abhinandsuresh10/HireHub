import { Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/status.constants';
import { verifyAccessToken } from '../utils/jwToken';
import { AuthRequest, JwtPayload } from '../types/jwt.types';

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

        if (!accessToken) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Access token not provided'
            });
            return;
        }

        const decodedAccess = verifyAccessToken(accessToken);

        if (typeof decodedAccess === "object" && decodedAccess !== null) {
            req.user = decodedAccess as JwtPayload;
            next();
            return;
        }

        res.status(HttpStatus.UNAUTHORIZED).json({
            status: 'error',
            message: 'Invalid or expired access token'
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'JWT middleware error'
        });
    }
};