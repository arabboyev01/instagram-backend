"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putData = void 0;
const index_1 = require("./connect/index");
const putData = (req, res) => {
    const login_id = req.params.id;
    const { comment, content } = req.body;
    (0, index_1.dataBase)('posts').where({ login_id: login_id }).update({ comment, content })
        .then(() => {
        res.status(200).json({ message: 'Item updated successfully' });
    })
        .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error updating item' });
    });
};
exports.putData = putData;
