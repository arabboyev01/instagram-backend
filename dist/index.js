"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const PutMethod_1 = require("./PutMethod");
const VerifyToken_1 = require("./VerifyToken");
const PostMethods_1 = require("./PostMethods");
const GetMethod_1 = require("./GetMethod");
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('uploads'));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.post("/login", PostMethods_1.CheckUsers);
app.post('/register', PostMethods_1.RegisterUser);
app.get('/', GetMethod_1.GetSingleUser);
app.put('/api/post/:id', upload.single('content'), VerifyToken_1.verifyToken, PutMethod_1.putData);
