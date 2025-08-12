// Route for refreshToken for all sides...
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/jwToken';

const authRouter = express.Router();

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Utility function to handle refresh logic

function handleRefresh(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const user = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const newAccessToken = generateAccessToken(user.id);
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
}

// endpoint with functions...

authRouter.post('/refresh/user', (req: Request, res: Response) => {
  handleRefresh(req, res);
});


export default authRouter;
