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

app.get('/', (req,res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email','password').from('login')
    .where('email','=',req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password,data[0].password);
        if(isValid) {
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(error => res.status(400).json('unable to get users'))
        }else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(error => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const pass = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            email : email,
            password : pass
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
             .returning('*')
             .insert({
               email: loginEmail[0],
               name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
          }) 
        })
        .then(trx.commit)
        .catch(trx.rollback)
    } )
    .catch(err => res.status(400).json('unable to register'));
   
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
    db('users').where({id})
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(error => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})