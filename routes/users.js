var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/login', (req, res, next) => {
  const errors = req.flash().error || [];
  res.render('login', { errors });
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
}), (req, res, next) => {
  res.redirect('/create-post');
});

module.exports = router;
