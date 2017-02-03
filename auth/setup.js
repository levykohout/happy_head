const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userSchema');

exports.setup = function () {
  passport.use('local', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    firstName: 'firstName',
    lastName: 'lastName'
  }, findAndComparePassword));

  // converts user to user id
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  // converts user id to user
  passport.deserializeUser(function(id, done){
    User.findById(id).then(function(user){
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

function findAndComparePassword(email, password, done) {

  User.findOne({ email: email }).then(function(user){

    if (!user) {
      // didn't find a user with the same email
      console.log('failed to find user with email:', email);
      return done(null, false);
    }

    user.comparePassword(password)
        .then(function(isMatch){
          if (isMatch) {
            console.log('setup isMatch', isMatch);
            // successfully auth the user
            done(null, user);
          } else {
            done(null, false);
          }
        }).catch(function(err) {
          done(err);
        });
  })
  .catch(function(err){
    console.log('Error finding user', err);
    done(null, false);
  });
}
