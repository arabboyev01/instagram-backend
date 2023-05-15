import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { putData } from "./PutMethod.js"
import { verifyToken } from "./VerifyToken.js";
import { CheckUsers, RegisterUser } from "./PostMethods.js"
import { GetSingleUser } from "./GetMethod.js"
import multer from "multer"


const app = express();

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'))
const upload = multer({ dest: 'uploads/' });

app.post("/login", CheckUsers);

app.post('/register', RegisterUser)

app.get('/', GetSingleUser);

app.put('/api/post/:id', upload.single('content'), verifyToken, putData)