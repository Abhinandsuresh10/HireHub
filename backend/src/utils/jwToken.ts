import jwt from 'jsonwebtoken';

export function generateAccessToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '150m' });
}

export function generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    } catch (err) {
      console.error(err)
      return null;
    }
  }