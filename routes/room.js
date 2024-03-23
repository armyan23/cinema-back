const express = require('express');

const { getRooms, createRoom, getRoom, updateRoom, deleteRoom} = require("../controllers/room");

const router = express.Router();

router.get('/all', getRooms);
router.post('/', createRoom);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
