const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqSchema = new Schema({
  question: {type:String, maxlength: 200},
  answer: {type:String, maxlength: 200}
})

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
