"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleUser = void 0;
const index_mjs_1 = require("./connect/index.mjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GetSingleUser = (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.decode(token);
    const id = decoded.id;
    if (token) {
        index_mjs_1.dataBase.select('*').from('posts').where({ login_id: id }).then((data) => {
            res.status(200).json(data);
        });
    }
};
exports.GetSingleUser = GetSingleUser;
