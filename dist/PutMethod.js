import { dataBase } from "./connect/index.js";
export const putData = (req, res) => {
    const login_id = req.params.id;
    const { comment, content } = req.body;
    dataBase('posts').where({ login_id: login_id }).update({ comment, content }).then(() => {
        res.status(200).json({ message: 'Item updated successfully' });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error updating item' });
    });
};
