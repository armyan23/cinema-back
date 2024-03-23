const express = require('express');
const movieRouter = require("./movie");
const roomRouter = require("./room");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/movie', movieRouter);
router.use('/room', roomRouter);

module.exports = router;
