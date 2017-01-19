var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../server/models/userSchema');

router.post('/', function(req, res) {
    console.log('registering new user');

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        accessLevel: req.body.accessLevel
    });

    user.save().then(function(user) {
        res.send(user);

    }).catch(function(err) {
        console.log('Error in /admin', err);
        res.sendStatus(500);
    });
});

router.get('/', function(req, res) {
    console.log('getting users');

    //finds all users inside admin database
    User.find({}).then(function(people) {
        res.send(people);

    }).catch(function(err) {
        console.log('Error in /register', err);
        res.sendStatus(500);
    });
});

//get logged in user to display
router.get('/adminSchema', function(req, res) {
    console.log(req.body);

    if (req.isAuthenticated()) {
        var user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            accessLevel: req.user.accessLevel,
            loggedInDate: req.user.loggedInDate,
            _id: req.user._id
        }
        return res.send(user);
        console.log(user);
    }
    res.sendStatus(401);
});

router.put('/:id', function(req, res) {
    console.log('updating user');
    var id = req.params.id;
    console.log(id);

    User.findById(id, function(err, user) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        //set values
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.accessLevel = req.body.accessLevel;

        user.save(function(err, updatedUser) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(updatedUser);
        });
    });
});



router.delete('/:id', function(req, res) {
    console.log('deleting user');
    var id = req.params.id;
    // console.log(id);

    //finds all users inside admin database
    User.remove({
        "_id": id
    }).then(function(people) {
        res.sendStatus(200);

    }).catch(function(err) {
        console.log('Error in deleting admin user', err);
        res.sendStatus(500);
    });
});



module.exports = router;
