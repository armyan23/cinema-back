const express = require('express');

const { getMoviesByRoom, reserveMovieSeats, getMovie, createMovie, updateMovie, deleteMovie } = require("../controllers/movie");

const router = express.Router();

router.get('/room/:roomName', getMoviesByRoom);
router.post('/reserve', reserveMovieSeats);

router.post('/', createMovie);
router.get('/:id', getMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
