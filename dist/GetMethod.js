import { dataBase } from "./connect/index.js";
import jwt from "jsonwebtoken";
export const GetSingleUser = (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const id = decoded.id;
    if (token) {
        dataBase.select('*').from('posts').where({ login_id: id }).then((data) => {
            res.status(200).json(data);
        });
    }
};
