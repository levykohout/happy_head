const router = require('express').Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../../server/models/userSchema');

router.post('/', passport.authenticate('local'), function(req, res) {
    res.sendStatus(200);
});

router.get('/info', function(req, res) {
    if (req.isAuthenticated()) {
        var user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            accessLevel: req.user.accessLevel,
            loggedInDate: req.user.loggedInDate,
            _id: req.user._id
        };
        res.send(user);
        console.log(user);

    } else {
        res.sendStatus(401);
    }
});

router.put('/update/:id', function(req, res) {
    console.log('updating admin user');
    var id = req.params.id;
    console.log(id);

    User.findById(id, function(err, user) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        //set values
        user.password = req.body.password;
        user.loggedInDate = new Date();


        user.save(function(err, updatedUser) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(updatedUser);
        });
    });
});


router.post('/mail', function(req, res) {
    var email = req.body.email;
    var randomPassword = Math.random().toString(36).slice(2, 10);

    User.find({
        "email": email
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        user[0].password = randomPassword;
        user[0].loggedInDate = '';
        user[0].save().then(function(people) {


            var transporter = nodemailer.createTransport('smtps://bwatch36%40gmail.com:bluewatch36@smtp.gmail.com');

            var mailOptions = {
                from: 'bwatch36@gmail.com',
                to: people.email,
                subject: 'Password Reset ',
                html: '<div><p>Below is your temporary password! You can change your password after you login!</p></div><div>' + randomPassword + ' </div>'
            };
            //
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);

                }
                res.send(info.response);
            }); // end sendMail


        }).catch(function(err) {
            console.log('Error in /mail', err);
            res.sendStatus(500);

        }); //End of user.save


    }); //End of Admin.find

});

module.exports = router;
