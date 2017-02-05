var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Hits = require('../models/hitsSchema');

router.post('/', function(req, res) {
    console.log('saving hit data');

    const hit = new Hits({
      impactLevel: req.body.impactLevel,
      timeStamp: req.body.timeStamp,
      intensity:req.body.intensity
    });

    hit.save().then(function(hit) {
        res.send(hit);

    }).catch(function(err) {
        console.log('Error in saving hit data', err);
        res.sendStatus(500);
    });
});

router.get('/', function(req, res){
  console.log('getting hits data');
  Hits.find({}).then(function(hits) {
      res.send(hits);

  }).catch(function(err) {
      console.log('Error in getting hits data', err);
      res.sendStatus(500);
  });

});


module.exports = router;
