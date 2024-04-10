import { NextFunction, Request, Response } from 'express';

const requireAuth = (
  req: Request,
  res: Response<string>,
  next: NextFunction
) => {
  if (!req.session?.userId) {
    res.status(401).send('Unauthorized: User is not logged in');
    return;
  }

  next();
};

export default requireAuth;
