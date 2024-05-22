const express = require('express');
var router = express.Router();
const { search } = require("../src/search")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', search);

module.exports = router;
