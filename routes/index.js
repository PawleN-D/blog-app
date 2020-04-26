var express = require('express');
var router = express.Router();
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/', (req, res, next) => {
//   const posts = req.app.locals.posts;

//   posts
//       .find({})
//       .toArray()
//       .then(posts => res.render('posts', { posts }));
// });


module.exports = router;
