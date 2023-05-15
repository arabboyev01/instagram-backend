import { dataBase } from "./connect/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const CheckUsers = (req, res) => {
    const { username, password } = req.body;
    dataBase('login').select('password').where({ username }).then((hashPassword) => {
        console.log(hashPassword);
        bcrypt.compare(password, hashPassword[0].password, (err, result) => {
            dataBase.select('id').from('login').where({ username }).then((userId) => {
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
};
// What do you do about an expression such as O ( N
// 2 + N)? That second N isn't exactly a constant. But it's
// not especially important
export const RegisterUser = (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, password) => {
            await dataBase('login').insert({ username, password, firstname, lastname });
            dataBase.select('id').from('login').where({ username }).then((userId) => {
                const token = jwt.sign({ id: userId[0].id }, 'secret');
                userId && res.json({ token, userId });
                !userId && res.status(401).json("something went wrong");
                dataBase('posts').insert({ login_id: userId[0].id });
                dataBase('profile').insert({ login_id: userId[0].id, firstname, lastname, username });
            });
        });
    });
};
