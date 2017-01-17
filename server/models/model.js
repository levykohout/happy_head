var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

}); //end userSchema

var User = mongoose.model('model', userSchema);

module.exports= User;
