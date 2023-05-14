"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jsonwebtoken_1.default.verify(token, 'secret', (err, decoded) => {
        err && res.status(401).json({ message: 'Invalid token' });
        req.decoded = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
