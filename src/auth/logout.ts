import { Request, Response } from 'express';

const logout = (req: Request, res: Response<string>) => {
  // res.status(501).send('Logout is under construction.');
  if (!req.session?.userId) {
    res.status(401).send('No one was logged in');
    return;
  }

  const userId = req.session.userId;
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(200).send(`User ${userId} logged out successfully`);
  });
};

export default logout;
