const express = require('express');
const knex = require('knex');
import bodyParser from "body-parser";

const app = express();
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
app.use(bodyParser.json());

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

const response = [{
  id:0, 
  firstName: "Abbosbek",
  lastName: "Arabboev"
}]

app.get('/', (req: any, res: any) => {
  res.json(dataBase.select('*').from('post'));
});


app.post('/post', (req: any, res: any) => {
  const {media, userName} = req.body;
  console.log(req.body);
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