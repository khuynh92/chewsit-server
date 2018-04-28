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

//database test get
app.get('/testUsers', (req, res) => {
  client.query(`
  SELECT users.name, favorites.yelp_id FROM users
  INNER JOIN favorites ON users.id = favorites.favorites_id
  WHERE users.id=2;
  `)
    .then(results => res.send(results.rows));
});

//database test new user
app.post('/addUser', (req, res) => {
  client.query(`
  INSERT INTO users (name, pin)
  VALUES ($1, $2);
  `,
  [request.params.name, request.params.pin]
  )
    .then(results => res.send(results.rows));
});

//database test new favorite
app.post('/newFavorite', (req, res) => {
  client.query(`
  INSERT INTO favorites (yelp_id, favorites_id)
  VALUES ($1, $2);
  `,
  [request.params.yelp_id, request.params.favorites_id]
  )
    .then(results => res.send(results.rows));
});

//database test update user info

//database test update favorite info