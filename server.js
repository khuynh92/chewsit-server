// import { request } from 'https';

require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', err => {
  console.error(err);
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
 

//Changed open now to false to test categories after hours 
app.get('/api/yelp/v3/:food/:zip/:price/:range/:offset', (req, res) => {
  superagent.get(`https://api.yelp.com/v3/businesses/search?open_now=true&categories=${req.params.food}&location=${req.params.zip}&limit=50&price=${req.params.price}&radius=${req.params.range}&offset=${req.params.offset}`)
    .set('Authorization', `Bearer ${API_KEY}`)
    .then(results => res.send(JSON.parse(results.text)))
    .catch(err => console.log(err));
});
//Changed open now to false to test categories after hours
app.get('/total/api/yelp/v3/:food/:zip/:price/:range', (req, res) => {
  superagent.get(`https://api.yelp.com/v3/businesses/search?open_now=true&categories=${req.params.food}&location=${req.params.zip}&limit=50&price=${req.params.price}&radius=${req.params.range}`)
    .set('Authorization', `Bearer ${API_KEY}`)
    .then(results => {
      res.send(JSON.stringify(JSON.parse(results.text).total));
    })
    .catch(err => console.log(err));
});

//database test get all users and favorites
app.get('/all', (req, res) => {
  client.query(`
  SELECT * FROM users
  INNER JOIN favorites ON users.id = favorites.users_id
  ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.log(err));    
});

//database get all users
app.get('/users/all', (req, res) => {
  client.query(`
  SELECT * FROM users
  ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.log(err));   
});

//database add new user
app.post('/users/new', (req, res) => {
  client.query(`
  INSERT INTO users (name, pin)
  VALUES ($1, $2)
  ;`,
  [req.body.name, req.body.pin]
  )
    .then(results => res.send(results.rows))
    .catch(err => console.log(err));
});

//database get all favorites
app.get('/favorites/all', (req, res) => {
  client.query(`
    SELECT * FROM favorites
    ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.log(err));   
});

//database add new favorite
app.post('/favorites/new', (req, res) => {
  client.query(`
  INSERT INTO favorites (yelp_id, users_id)
  VALUES ($1, $2)
  ;`,
  [req.body.yelp_id, req.body.users_id]
  )
    .then(results => res.send(results.rows))
    .catch(err => console.log(err));
});


//database test update user info

app.put('/users/update/name', (req, res) => {
  client.query(`
  UPDATE users
  SET name=$1
  WHERE id=$2
  ;`,
  [request.params.name, request.params.id]
  )
    .then(results => res.send('Update successful'))
    .catch(err => console.log(err))
});

app.put('/users/update/pin', (req, res) => {
  client.query(`
  UPDATE users
  SET pin=$1
  WHERE id=$2
  ;`,
  [req.params.pin, req.params.id])
    .then(results => res.send('Update successful'))
    .catch(err => console.log(err));
});

//database test update favorite info

app.put('/users/update/favorites', (req, res) => {
  client.query(`
  UPDATE favorites
  SET yelp_id=$1
  WHERE users_id=$2
  `,
  [req.params.yelp_id, req.params.favorites_id])
    .then(results => res.send('Update successful'))
    .catch(err => console.log(err));
});

//database delete favorite
app.delete('/favorites/delete/:id', (req, res) => {
  client.query(`
  DELETE FROM favorites
  where users_id=$1
 `,
  [req.params.id])
    .then(results => res.send('Delete successful'))
    .catch(err => console.log(err));
});


//database delete user
app.delete('/users/delete/:id' , (req, res) => {
  client.query(`
  DELETE FROM users
  where id=$1
 ;`,
  [request.params.id])
    .then(results => res.send('Delete successful'))
    .catch(err => console.log(err));
});