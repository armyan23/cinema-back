const { client } = require('./../services/initializer');
const {ObjectId} = require("mongodb");

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

const getMoviesByRoom = async (req, res) => {
    try {
        const { roomName } = req.params

        const greenRoom = await client.db('cinema').collection('rooms').findOne({ name: roomName });

        if (!greenRoom) {
            console.log(`Room with name ${roomName} not found`)
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const moviesByRoom = await client.db('cinema').collection('movies').find({ roomId: greenRoom._id }).toArray();

        return res.status(200).json({
            message: 'Successfully',
            data: moviesByRoom,
        });
    }catch (e) {
        console.log('getMoviesByRoom', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params

        const movie = await client.db('cinema').collection('movies').findOne({ _id: new ObjectId(id) });

        if (!movie) {
            console.log(`Movie with id - ${id} not found`)
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            message: 'Successfully',
            data: movie,
        });
    }catch (e) {
        console.log('getMovieDetails', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const reserveMovieSeats = async (req, res) => {
    try {
        const { seats, movieId } = req.body

        const movie = await client.db('cinema').collection('movies').findOne({ _id: new ObjectId(movieId) });

        if (!movie) {
            console.log(`Movie with id - ${movieId} not found`)
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        for (let seat of seats){
            if (movie.unavailableSeats.includes(seat)){
                return res.status(400).json({
                    message: "These seats have already reserved. Please choose another seats."
                });
            }
        }

        await client.db('cinema').collection('movies').updateOne(
            { _id: new ObjectId(movieId) },
            { $push: { unavailableSeats: { $each: seats } } }
        );

        return res.status(200).json({
            message: "Seats reserved successfully",
            data: seats,
        });
    }catch (e) {
        console.log('getMovieDetails', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { getRooms, getMoviesByRoom, getMovieDetails, reserveMovieSeats }