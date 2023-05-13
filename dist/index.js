"use strict";
const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'));
const dataBase = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: '',
        password: '',
        database: 'instagram-database'
    }
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await dataBase('login').select('password').where({ username }).first();
    bcrypt.compare(password, hashPassword.password, (err, result) => {
        dataBase.select('id').from('login').where({ username }).then((userId) => {
            console.log(userId);
            if (result) {
                const token = jwt.sign({ id: userId[0].id }, 'secret');
                res.json({ token, userId: userId[0].id });
            }
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
});
app.post('/register', async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, password) => {
            await dataBase('login').insert({ username, password, firstname, lastname });
            dataBase.select('id').from('login').where({ username }).then((userId) => {
                const token = jwt.sign({ id: userId[0].id }, 'secret');
                userId && res.json({ token, userId });
                !userId && res.status(401).json("something went wrong");
                dataBase('posts').insert({ login_id: userId[0].id });
            });
        });
    });
});
function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        err && res.status(401).json({ message: 'Invalid token' });
        req.decoded = decoded;
        next();
    });
}
app.get('/', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const id = decoded.id;
    if (token) {
        dataBase.select('*').from('posts').where({ login_id: id }).then((data) => {
            res.status(200).json(data);
        });
    }
});
// "start": "nodemon --watch tsc 'src/**/*.ts' --exec 'npx tsc && node dist/index.js'",
const upload = multer({ dest: 'uploads/' });
app.put('/api/post/:id', upload.single('content'), verifyToken, (req, res) => {
    const login_id = req.params.id;
    const { comment, content } = req.body;
    console.log(comment, content);
    dataBase('posts').where({ login_id: login_id }).update({ comment, content })
        .then(() => {
        res.status(200).json({ message: 'Item updated successfully' });
    })
        .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error updating item' });
    });
});
