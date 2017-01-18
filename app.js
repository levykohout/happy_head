var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var twilioCreds = require('./server/smsconfig.json');
var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use( express.static( "public" ));


//database connection
// var mongoURI = "mongodb://localhost:27017/happyhead";
// var MongoDB = mongoose.connect(mongoURI).connection;
//
// MongoDB.on('error', function (err) {
//     console.log('mongodb connection error:', err);
// });
//
// MongoDB.once('open', function () {
//   console.log('mongodb connection open!');
// });

//twilio outbound
// Twilio Credentials
var accountSid = twilioCreds.accountSid;
var authToken = twilioCreds.authToken;

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
app.post('/twilio', function(req,res){
  console.log(req.body);
  var numberOfHits = req.body.count;
  var impactLevel = req.body.impactLevel;

  if(impactLevel=='medium'){
    url = 'https://projects.invisionapp.com/share/2YA1BZ293#/screens';
  } else if (impactLevel=='high'){
    url='https://projects.invisionapp.com/share/6NA1B95RV#/screens';
  }
  client.messages.create({
      to: "+16122033602",
      from: "+16122497350",
      body: numberOfHits  +" hit(s). To view data click here: "+ url
  }, function(err, message) {
      res.send(message.sid);
  });
});


app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, '/public/views/index.html'));
});

//server
app.listen('3000', function(){
  console.log('listening on 3000');
});
