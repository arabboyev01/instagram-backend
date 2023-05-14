import { dataBase } from "./connect/index.mjs"

export const putData = (req: any, res: any) => {
    const login_id = req.params.id;
    const { comment, content } = req.body; 
  
   dataBase('posts').where({login_id: login_id}).update({ comment, content })
    .then(() => {
      res.status(200).json({ message: 'Item updated successfully' });
    })
    .catch((err: any) => {
      console.error(err);
      res.status(500).json({ message: 'Error updating item' });
    });
}