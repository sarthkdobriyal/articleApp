import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const tokenSchema = z.object({
  userId: z.string(),
});

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface DecodedToken {
  userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const validatedToken = tokenSchema.parse(decoded);
    req.userId = validatedToken.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};