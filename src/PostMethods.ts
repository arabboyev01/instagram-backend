import { dataBase } from "./connect/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const CheckUsers =  (req: any, res: any) => {

  const { username, password } = req.body;
   dataBase('login').select('password').where({ username }).then((hashPassword: any) => {
     bcrypt.compare(password, hashPassword[0].password, (err: any, result: any) => {
     dataBase.select('id').from('login').where({ username }).then((userId: Object | any) => {
      if(result){
      const token = jwt.sign({ id: userId[0].id }, 'secret')
      res.json({ token, userId: userId[0].id });
      }else{
      res.status(401).json({ message: 'Invalid credentials' })
      }
    })
  });
   })
}

export const RegisterUser = (req: any, res: any) => {
  const {username, password, firstname, lastname} = req.body;
  bcrypt.genSalt(10, (err: any, salt: any) =>  {
    bcrypt.hash(password, salt, async(err: any, password: any) =>  {
      await dataBase('login').insert({ username, password, firstname, lastname });
      dataBase.select('id').from('login').where({ username }).then((userId: Object | any) => {
        const token =  jwt.sign({ id: userId[0].id }, 'secret');
        userId && res.json({ token, userId });
        !userId && res.status(401).json("something went wrong");
        dataBase('posts').insert({login_id: userId[0].id })
        dataBase('profile').insert({login_id: userId[0].id, firstname, lastname, username})
      })
    });
  });
}
