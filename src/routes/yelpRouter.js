import express from 'express';
import superagent from 'superagent';

const router = express.Router();

//Changed open now to false to test categories after hours 
router.get('/api/v3/yelp/:food/:location/:price/:range/:offset', (req, res) => {
  return superagent.get(`https://api.yelp.com/v3/businesses/search?categories=${req.params.food}&${req.params.location}&limit=50&price=${req.params.price}&radius=${req.params.range}&offset=${req.params.offset}`)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(results => res.send(JSON.parse(results.text)))
    .catch(err => console.error(err));
});

export default router;