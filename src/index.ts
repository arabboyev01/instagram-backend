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

  const user = await dataBase('login').select('id').where({ username, password }).first()

  if(user !== undefined){
    const token = jwt.sign({ id: user.id }, 'secret');
    user && res.json({ token, userId: user.id });
  }else {
    !user && res.status(401).json({ message: 'Invalid credentials' })
  }
  
});

app.post('/register', async (req: any, res: any) => {
  const {username, password, firstname, lastname} = req.body;

   const userId = await dataBase('login')
   .insert({ username, password, firstname, lastname }, 'id');
   const token = jwt.sign({ userId }, 'secret');
  
   userId && res.json({ token, userId });
   !userId && res.status(401).json("something went wrong");

})

app.post('/post', (req: any, res: any) => {
  const {media, userName} = req.body;
  dataBase('post')
   .returning('*')
   .insert({
    date: new Date(),
    media: media,
    username: userName,
    likes: 0
  }).then((response: any) => {
    res.json(response)
  })
})