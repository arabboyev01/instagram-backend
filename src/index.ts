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
    host : '127.0.0.1',
    port : 5432,
    user : '',
    password : '',
    database : 'instagram-database'
  }
});

app.get('/', (req: any, res: any) => {
  dataBase.select('*').from('login').then((data: any) => res.json(data))
});

app.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  const hashPassword = await dataBase('login').select('password').where({ username }).first()

  bcrypt.compare(password, hashPassword.password, (err: any, result: any) => {

    dataBase.select('id').from('login').where({ username }).then((userId: Object | any) => {
      console.log(userId);
      if(result){
      const token = jwt.sign({ id: userId[0].id }, 'secret')
      res.json({ token, userId: userId[0].id });
    }else{
      res.status(401).json({ message: 'Invalid credentials' })
    }
    })
  });

});

app.post('/register', async (req: any, res: any) => {

  const {username, password, firstname, lastname} = req.body;

  bcrypt.genSalt(10, (err: any, salt: any) =>  {
    bcrypt.hash(password, salt, async(err: any, password: any) =>  {

      await dataBase('login').insert({ username, password, firstname, lastname });

      dataBase.select('id').from('login').where({ username }).then((userId: Object | any) => {
        const token =  jwt.sign({ id: userId[0].id }, 'secret');
        userId && res.json({ token, userId });
        !userId && res.status(401).json("something went wrong");
        dataBase('posts').insert({login_id: userId[0].id })
      })
    });
  });
})


function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, 'secret', (err: any, decoded: any) => {
    err && res.status(401).json({ message: 'Invalid token' });
    req.decoded = decoded;
    next();
  });
}
const upload = multer({ dest: 'uploads/' });

app.put('/api/post/:id', upload.single('content'), verifyToken, (req: any, res: any) => {

  const login_id = req.params.id;
  const { comment, content } = req.body; 
  console.log(comment, content);
  
   dataBase('posts').where({login_id: login_id}).update({ comment, content })
    .then(() => {
      res.status(200).json({ message: 'Item updated successfully' });
    })
    .catch((err: any) => {
      console.error(err);
      res.status(500).json({ message: 'Error updating item' });
    });
})