"use strict";
const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
    !user && res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, 'secret');
    user && res.json({ token, userId: user.id });
});
app.post('/register', (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    dataBase('login')
        .returning('*')
        .insert({
        username: username,
        password: password,
        firstname: firstName,
        lastname: lastName
    }).then((response) => {
        res.json(response);
    }).catch((error) => res.json(error));
});
app.post('/post', (req, res) => {
    const { media, userName } = req.body;
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
