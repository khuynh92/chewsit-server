require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT;
const app = express();
const API_KEY = process.env.API_KEY;
// const conString = 'postgres://postgres:3874@LOCALHOST:5432/DBNAME';
// const client = new pg.Client(conString);
// client.connect();
// client.on('error', err => {
// console.error(err);
// });

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(express.static('./public'));


app.get('/api/yelp/v3/sushi/98121', (req, res) => {
  superagent.get('https://api.yelp.com/v3/businesses/search?term=sushi&location=98121&limit=50&price=$$$$')
    .set('Authorization', `Bearer ${API_KEY}`)
    // .then(results => {
    //   var offset = Math.floor(Math.random()*JSON.parse(results.text).total);
    // } )
    .then(results => res.send(JSON.parse(results.text)))
    .catch(err => console.log(err));
});

app.get('/api/yelp/v3/:food/:zip/:price/:range', (req, res) => {
  superagent.get(`https://api.yelp.com/v3/businesses/search?open_now=true&term=${req.params.food}&location=${req.params.zip}&limit=50&price=${req.params.price}&radius=${req.params.range}`)
  .set('Authorization', `Bearer ${API_KEY}`)
  .then(results => res.send(JSON.parse(results.text)))
  .catch(err => console.log(err));
});




 
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));