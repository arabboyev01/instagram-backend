const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.post("/login", (req: any, res: any) => {
  const { username, password } = req.body;
  dataBase
    .select("*")
    .from("login")
    .then((users: any) => {
      users.map((user: any) => {
        console.log(typeof user.password, typeof user.username)
         if(user.username === username && user.password === password) {
             res.status(200).json("You can log in");
        }else{
           res.status(400).json("Please sign up first")
        }
      })
    })
});

app.post('/register', (req: any, res: any) => {
  const {username, password} = req.headers;
  dataBase('login')
   .returning('*')
   .insert({
    username: username,
    password: password
  }).then((response: any) => {
    res.json(response)
  }).catch((error: any) => console.error(error))
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