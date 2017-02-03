const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hitsSchema = new Schema({
  impactLevel: String,
  timeStamp: Date,
  intensity: Number
})

const Hits = mongoose.model('Hits', hitsSchema);

module.exports = Hits;
