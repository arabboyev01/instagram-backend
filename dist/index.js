"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const knex = require('knex');
const body_parser_1 = __importDefault(require("body-parser"));
const app = express();
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
app.use(body_parser_1.default.json());
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
const response = [{
        id: 0,
        firstName: "Abbosbek",
        lastName: "Arabboev"
    }];
app.get('/', (req, res) => {
    res.json(dataBase.select('*').from('post'));
});
app.post('/post', (req, res) => {
    const { media, userName } = req.body;
    console.log(req.body);
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
