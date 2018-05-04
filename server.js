// import { request } from 'https';

require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
//MAKE SURE TO ADD ENV URL TO HEROKU!!!!

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
app.get('/api/yelp/v3/:food/:location/:price/:range/:offset', (req, res) => {
  superagent.get(`https://api.yelp.com/v3/businesses/search?categories=${req.params.food}&${req.params.location}&limit=50&price=${req.params.price}&radius=${req.params.range}&offset=${req.params.offset}`)
    .set('Authorization', `Bearer ${API_KEY}`)
    .then(results => res.send(JSON.parse(results.text)))
    .catch(err => console.error(err));
});

//database get all users and favorites
app.get('/all', (req, res) => {
  client.query(`
  SELECT * FROM users
  INNER JOIN favorites ON users.id = favorites.users_id
  ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.error(err));
});

//database get all users
app.get('/users/all', (req, res) => {
  client.query(`
  SELECT * FROM users
  ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.error(err));
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
    .catch(err => {
      console.error(err);
      res.send(400);
    });
});

//database get all favorites
app.get('/favorites/all', (req, res) => {
  client.query(`
    SELECT * FROM favorites
    ;`)
    .then(results => res.send(results.rows))
    .catch(err => console.error(err));
});

//database add new favorite
app.post('/favorites/new', (req, res) => {
  client.query(`
  INSERT INTO favorites (yelp_id, users_id, notes)
  VALUES ($1, $2)
  ;`,
  [req.body.yelp_id, req.body.users_id, req.body.notes]
  )
    .then(results => res.send(results.rows))
    .catch(err => console.error(err));
});

//database update preferences
app.put('/preferences/update', (req, res) => {
  client.query(`
  UPDATE users 
  SET preferences = $1
  WHERE id = $2
  ;`,
  [req.body.preferences, req.body.id]
  )
    .then(() => res.send('Preferences updated'))
    .catch(err => console.error(err));
});

//database login
app.get('/users/login/:userName/:userPin', (req, res) => {
  client.query(`
  SELECT * FROM users
  WHERE name = $1
  AND pin = $2
  ;`,
  [req.params.userName, req.params.userPin]
  )
    .then(results => {
      res.send(results.rows);
      console.log(results);
    })
    .catch(err => console.error(err));
});

//database retrieve favorites
app.get('/users/favorites/:userID', (req, res) => {
  client.query(`
  SELECT yelp_id, notes, rest_name FROM users
  JOIN favorites ON users.id = favorites.users_id
  WHERE id = $1
  ;`,
  [req.params.userID]
  )
    .then(results => {
      res.send(results.rows);
      console.log(results);
    })
    .catch(err => console.error(err));
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
    .catch(err => console.error(err));
});

//database delete favorite
app.delete('/favorites/delete/:id', (req, res) => {
  client.query(`
  DELETE FROM favorites
  where users_id=$1
 `,
  [req.params.id])
    .then(results => res.send('Delete successful'))
    .catch(err => console.error(err));
});

//database test update user info

//database delete user
app.delete('/users/delete/:id', (req, res) => {
  client.query(`
  DELETE FROM users
  where id=$1
 ;`,
  [request.params.id])
    .then(results => res.send('Delete successful'))
    .catch(err => console.error(err));
});