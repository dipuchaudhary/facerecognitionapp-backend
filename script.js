const express = require('express');

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt-nodejs');

const cors = require('cors');

const knex = require('knex');

const app = express();

const register = require('./container/register');
const signin = require('./container/signin');
const profile = require('./container/profile');
const image = require('./container/image');

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
    res.send('Its working!');
})

app.post('/signin', (req, res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req,res,db)})

app.put('/image', (req, res) => {image.handleImage(req,res,db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})

app.listen(process.ENV.PORT || 3000, () => {
    console.log(`app is running on port ${process.ENV.PORT}`);
})