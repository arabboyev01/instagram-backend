import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) =>  {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, 'secret', (err: any, decoded: any) => {
    err && res.status(401).json({ message: 'Invalid token' });
    req.decoded = decoded;
    next();
  });
}

