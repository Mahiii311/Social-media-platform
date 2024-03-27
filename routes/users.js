var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('page/timeline', { title: 'user'});  //have to change
// });

//loading profile page
router.get('/profile', function(req, res, next) {
  res.render('user/profile', { title: 'user'});  //have to change
});

module.exports = router;
