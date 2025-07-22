import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const roleActionGuard = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const user = authReq.user;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required for this action.' });
  }

  const { role } = user;
  const method = req.method;
  const path = req.path;
  
  // Admin has full access
  if (role === 'ADMIN') {
    return next();
  }
  
  // Guest can only perform GET requests
  if (role === 'GUEST') {
    if (method === 'GET') {
      return next();
    }
    return res.status(403).json({ message: 'Guests are not permitted to perform this action.' });
  }
  
  // Dealer permissions
  if (role === 'DEALER') {
    if (method === 'GET') {
      return next();
    }
    
    // Allow POST only to /submissions
    if (method === 'POST' && path.startsWith('/submissions')) {
        return next();
    }

    // Allow PATCH only to /forecasts/:id
    if (method === 'PATCH' && path.startsWith('/forecasts/')) {
      // Additional logic in the controller will ensure they only patch their own forecast
      return next();
    }
    
    // Allow POST to /users/change-password
    if (method === 'POST' && path.startsWith('/users/change-password')) {
        return next();
    }

    return res.status(403).json({ message: 'Dealers are not permitted to perform this action.' });
  }

  // Default deny
  return res.status(403).json({ message: 'You do not have permission to perform this action.' });
};