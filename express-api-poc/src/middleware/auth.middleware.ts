import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

const SECRET_KEY = 'your-secret-key';

// ~Authentication with token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  console.log('Received token:', token);

  const decoded = jwt.verify(token, SECRET_KEY);
  console.log('Decoded token:', decoded);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ~Authorization- role-based authorization middleware
export const authorize = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
