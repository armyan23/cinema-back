const { client } = require('./../services/initializer');
const {ObjectId} = require("mongodb");

const { createRoomSeats} = require('./../utils/index');

const getRooms = async (req, res) => {
    try {
        const room = await client.db('cinema').collection('rooms').find().toArray();

        return res.status(200).json({
            message: 'Successfully',
            data: room,
        });
    }catch (e) {
        console.log('getRooms', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getRoom = async (req, res) => {
    try {
        const { id } = req.params

        const room = await client.db('cinema').collection('rooms').findOne({
            _id: new ObjectId(id)
        });

        if (!room) {
            console.log(`Room with id - ${id} not found`)
            return res.status(404).json({
                message: "Room not found"
            });
        }

        return res.status(200).json({
            message: 'Successfully',
            data: room,
        });
    }catch (e) {
        console.log('getRoom', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const createRoom = async (req, res) => {
    try {
        const data = req.body

        const existedRoom = await client.db('cinema').collection('rooms').findOne({
            name: data.name
        });

        if (existedRoom) {
            console.log(`Room with this name already created.`)
            return res.status(404).json({
                message: "Room with this name already created."
            });
        }
        const seats = createRoomSeats(data.row, data.column)

        const room = await client.db('cinema').collection('rooms').insertOne({
                ...data,
                seats,
        });

        return res.status(200).json({
            message: 'Room successfully created.',
            data: room,
        });
    }catch (e) {
        console.log('createRoom', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const updateRoom = async (req, res) => {
    try {
        const data = req.body
        const { id } = req.params

        const room = await client.db('cinema').collection('rooms').findOne({
            _id: new ObjectId(id)
        });

        if (!room) {
            console.log(`Room with id - ${room} not found`)
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const seats = createRoomSeats(data.row, data.column)

        await client.db('cinema').collection('rooms').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...data, seats } }
        );

        return res.status(200).json({
            message: 'Room successfully updated.',
            data: data,
        });
    }catch (e) {
        console.log('updateRoom', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params

        const room = await client.db('cinema').collection('rooms').findOne({
            _id: new ObjectId(id)
        });

        if (!room) {
            console.log(`Room with id - ${id} not found`)
            return res.status(404).json({
                message: "Room not found"
            });
        }

        await client.db('cinema').collection('rooms').deleteOne({
            _id: new ObjectId(id)
        });

        return res.status(200).json({
            message: 'Room successfully deleted.',
            data: [],
        });
    }catch (e) {
        console.log('deleteRoom', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom }