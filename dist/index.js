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
app.get('/', (req, res) => {
    dataBase.select('*').from('login').then((data) => res.json(data));
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await dataBase('login').select('id').where({ username, password }).first();
    if (user !== undefined) {
        const token = jwt.sign({ id: user.id }, 'secret');
        user && res.json({ token, userId: user.id });
    }
    else {
        !user && res.status(401).json({ message: 'Invalid credentials' });
    }
});
app.post('/register', async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, password) => {
            const userId = await dataBase('login').insert({ username, password, firstname, lastname }, 'id');
            const token = jwt.sign({ userId }, 'secret');
            userId && res.json({ token, userId });
            !userId && res.status(401).json("something went wrong");
            await dataBase('posts').insert({ login_id: userId[0].id });
        });
    });
});
app.post('/post', (req, res) => {
    const { media, userName } = req.body;
    ``;
    dataBase('post')
        .returning('*')
        .insert({
        date: new Date(),
        media: media,
        username: userName,
        likes: 0
    }).then((response) => {
        res.json(response);
    });
});
function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.decoded = decoded;
        next();
    });
}
const upload = multer({ dest: 'uploads/' });
app.put('/api/post/:login_id', upload.single('content'), verifyToken, (req, res) => {
    // const {comment} = req.body;
    // const {content} = req.file;
    // const login_id = req.params.login_id;
    // console.log("comment", comment)
    // console.log("content", content)
    // console.log("loginId", login_id)
    const { comment } = req.body;
    const imageBuffer = req.file.path;
    console.log(comment);
    console.log(imageBuffer);
    //  dataBase('posts').where(login_id).update({ comment, content })
    //   .then(() => {
    //     res.status(200).json({ message: 'Item updated successfully' });
    //   })
    //   .catch((err: any) => {
    //     console.error(err);
    //     res.status(500).json({ message: 'Error updating item' });
    //   });
});
