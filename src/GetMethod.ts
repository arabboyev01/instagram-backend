import { dataBase } from "./connect/index.js";
import jwt from "jsonwebtoken";


export const GetSingleUser =  (req: any, res: any) => {
  const authHeader =  req.headers.authorization;
  const token =  authHeader.split(' ')[1]
  const decoded: any =  jwt.decode(token);
  const id = decoded.id

  if(token){
     dataBase.select('*').from('posts').where({login_id: id}).then((data: any) =>{
     res.status(200).json(data);
    })
  }
}
