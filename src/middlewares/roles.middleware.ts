import { Response, NextFunction } from 'express';
import { Request } from 'express';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not have permission to access this resource' });
    }
    next();
  };
};
