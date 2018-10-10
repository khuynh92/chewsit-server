import express from 'express';
import googleMaps from '@google/maps';

const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLE_API_KEY,
});

const router = express.Router();

//Changed open now to false to test categories after hours 
router.get('/api/v1/google/:address', (req, res) => {

  googleMapsClient.geocode({ 'address': req.params.address }, (results, status) => {

    if (status.json.status === 'OK') {
      var lat = status.json.results[0].geometry.location.lat;
      var lng = status.json.results[0].geometry.location.lng;
      res.send({lat,lng});
    }

    if (status.json.status === 'ZERO_RESULTS') {
      console.error('Could not fetch location');
      res.send('Could not fetch location');
    }
  });
});


export default router;