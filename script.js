const express = require('express');

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt-nodejs');

const cors = require('cors');

const knex = require('knex');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',//localhost
    user : 'postgres',
    password : 'root',
    database : 'smartbrain'
  }
});

console.log(db.select('*').from('users'));

app.get('/', (req,res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
   }   
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
         res.json(user);
    }).catch(err => res.status(400).json('unable to register'));
   
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
   db.select('*').from('users').where({id})
   .then(user => {
    if (user.length) {
        res.json(user[0]);
    }
    else{
        res.status(400).json('not found');
    }
   }).catch(error => res.status(400).json('getting error'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
           return res.json(user.entries);
        }
    })
    if(!found) {
       return res.status(404).json('not found');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})