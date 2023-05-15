import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        err && res.status(401).json({ message: 'Invalid token' });
        req.decoded = decoded;
        next();
    });
};
