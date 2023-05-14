"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = exports.CheckUsers = void 0;
const index_mjs_1 = require("./connect/index.mjs");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CheckUsers = (req, res) => {
    const { username, password } = req.body;
    const hashPassword = (0, index_mjs_1.dataBase)('login').select('password').where({ username }).first();
    console.log(hashPassword);
    bcrypt_1.default.compare(password, hashPassword.password, (err, result) => {
        index_mjs_1.dataBase.select('id').from('login').where({ username }).then((userId) => {
            if (result) {
                const token = jsonwebtoken_1.default.sign({ id: userId[0].id }, 'secret');
                res.json({ token, userId: userId[0].id });
            }
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};
exports.CheckUsers = CheckUsers;
const RegisterUser = (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    bcrypt_1.default.genSalt(10, (err, salt) => {
        bcrypt_1.default.hash(password, salt, async (err, password) => {
            await (0, index_mjs_1.dataBase)('login').insert({ username, password, firstname, lastname });
            index_mjs_1.dataBase.select('id').from('login').where({ username }).then((userId) => {
                const token = jsonwebtoken_1.default.sign({ id: userId[0].id }, 'secret');
                userId && res.json({ token, userId });
                !userId && res.status(401).json("something went wrong");
                (0, index_mjs_1.dataBase)('posts').insert({ login_id: userId[0].id });
                (0, index_mjs_1.dataBase)('profile').insert({ login_id: userId[0].id, firstname, lastname, username });
            });
        });
    });
};
exports.RegisterUser = RegisterUser;
