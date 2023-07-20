const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const {  name, fname , roll, otime , salary ,password } = req.body;
  let errors = [];

  if (!name || !fname || !roll || !otime || !salary|| !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  // name, fname , roll, otime , salary.
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      fname,
      roll,
      otime,
      salary,
      password
    });
  } else {
    User.findOne({ name: name }).then(user => {
      if (user) {
        errors.push({ msg: 'Name already exists' });
        res.render('register', {
          errors,
          name,
          fname,
          roll,
          otime,
          salary,
          password
        });
      } else {
        const newUser = new User({
          name,
          fname,
          roll,
          otime,
          salary,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      // Handle any error that occurred during logout
      console.log(err);
      return res.status(500).send('Error logging out');
    }
    // Logout successful, perform any additional logic or redirect
    res.redirect('/users/login');
  });
});

// router.get('/logout', (req, res) => {

//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;
