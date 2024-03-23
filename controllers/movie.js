const { client } = require('./../services/initializer');
const {ObjectId} = require("mongodb");

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

const createMovie = async (req, res) => {
    try {
        const data = req.body

        const room = await client.db('cinema').collection('rooms').findOne({
            _id: new ObjectId(data.roomId)
        });

        if (!room) {
            console.log(`Room with id - ${data.roomId} not found`)
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const movie = await client.db('cinema').collection('movies').insertOne({
            ...data,
            seats: room.seats
        });

        return res.status(200).json({
            message: 'Movie successfully created',
            data: movie,
        });
    }catch (e) {
        console.log('createMovie', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getMovie = async (req, res) => {
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
        console.log('getMovie', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const updateMovie = async (req, res) => {
    try {
        const data = req.body
        const { id } = req.params

        const movie = await client.db('cinema').collection('movies').findOne({ _id: new ObjectId(id) });

        if (!movie) {
            console.log(`Movie with id - ${id} not found`)
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        await client.db('cinema').collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );

        return res.status(200).json({
            message: 'Movie successfully updated.',
            data: data,
        });
    }catch (e) {
        console.log('updateMovie', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params

        const movie = await client.db('cinema').collection('movies').findOne({
            _id: new ObjectId(id)
        });

        if (!movie) {
            console.log(`Movie with id - ${id} not found`)
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        await client.db('cinema').collection('movies').deleteOne({
            _id: new ObjectId(id)
        });

        return res.status(200).json({
            message: 'Movie successfully deleted.',
            data: [],
        });
    }catch (e) {
        console.log('deleteMovie', e);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { getMoviesByRoom, reserveMovieSeats, createMovie, getMovie, updateMovie, deleteMovie }