// import mongoose
const mongoose = require('mongoose')

let Movie

exports.initialize = connectionString => {
    return new Promise((resolve, reject) => {
        mongoose.connect(connectionString).then(() => {
            Movie = require('./models/movie')
            resolve()
        }, error => {
            reject(error)
        })
    })
}

exports.addNewMovie = data => {
    return new Promise((resolve, reject) => {
        let movie = new Movie({
            cast : data.cast ,
            countries : data.countries ,
            directors : data.directors ,
            fullplot :  data.fullplot ,
            genres : data.genres ,
            languages : data.languages ,
            lastupdated :  data.lastupdated ,
            metacritic :  data.metacritic ,
            num_mflix_comments :  data.num_mflix_comments ,
            plot :  data.plot ,
            poster :  data.poster ,
            rated :  data.rated ,
            released : data.released ,
            runtime :  data.runtime ,
            title :  data.title ,
            type :  data.type ,
            writers : data.writers ,
            year :  data.year ,
        })

        movie.save().then(createdMovie => {
            resolve(createdMovie)
        }, error => {
            reject(error)
        })
    })
}

exports.getAllMovies = (page, perPage, title) => {
    return new Promise((resolve, reject) => {
        if (!title) {
            Movie.find().limit(perPage).skip(perPage*(page-1)).sort({'_id': 1}).exec().then((result) => {
                resolve(result)
            }, error => {
                reject(error)
            })
        } else {
            Movie.find({"title": {$regex: title, $options: 'i'}}).limit(perPage).skip(perPage*(page-1)).sort({'_id': 1}).exec().then((result) => {
                resolve(result)
            }, error => {
                reject(error)
            })
        }
    })
}

exports.getMovieById = _id => {
    return new Promise((resolve, reject) => {
        Movie.findById(_id).exec().then((result) => {
            resolve(result)
        }, error => {
            reject(error)
        })
    })
}

exports.updateMovieById = (data, _id) => {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndUpdate(_id, {
            cast : data.cast ,
            countries : data.countries ,
            directors : data.directors ,
            fullplot :  data.fullplot ,
            genres : data.genres ,
            languages : data.languages ,
            lastupdated :  data.lastupdated ,
            metacritic :  data.metacritic ,
            num_mflix_comments :  data.num_mflix_comments ,
            plot :  data.plot ,
            poster :  data.poster ,
            rated :  data.rated ,
            released : data.released ,
            runtime :  data.runtime ,
            title :  data.title ,
            type :  data.type ,
            writers : data.writers ,
            year :  data.year ,
        }, {returnDocument: 'after'}).exec().then(updatedMovie => {
            resolve(updatedMovie)
        }, error => {
            reject(error)
        })
    })
}

exports.deleteMovieById = _id => {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndDelete(_id).exec().then((result) => {
            resolve(result)
        }, error => {
            reject(error)
        })
    })
}