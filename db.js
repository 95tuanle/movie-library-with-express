/******************************************************************************
 * ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 *  (including websites) or distributed to other students.
 * Group members:
 *  Nguyen Anh Tuan Le N01414195
 *  Shubham Singh N01469289
 * Date: December 6th, 2022
 * *********************************************************************************/
// import mongoose
const mongoose = require('mongoose')

let Movie
let User

exports.initialize = connectionString => {
    return new Promise((resolve, reject) => {
        mongoose.connect(connectionString).then(() => {
            Movie = require('./models/movie')
            User = require('./models/user')
            resolve()
        }, error => {
            reject(error)
        })
    })
}

exports.addNewUser = data => {
    return new Promise((resolve, reject) => {
        let user = new User({
            username: data.username,
            password: data.password,
        })

        user.save().then((createdUser) => {
            resolve(createdUser)
        }, (error) => {
            reject(error)
        })
        // User.findOne({'username': data.username}).exec().then((result) => {
        //     if (result !== null) {
        //         reject('Unable to create a new user with that username')
        //     } else {
        //
        //     }
        // }, (error) => {
        //     reject(error)
        // })
    })
}

exports.findUser = username => {
    return new Promise((resolve, reject) => {
        User.findOne({'username': username}).exec().then((result) => {
            resolve(result)
        }, (error) => {
            reject(error)
        })
    })
}

exports.updateUserToken = (username, token) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({'username': username}, {'token': token}, {returnDocument: 'after'}).exec().then((updatedUser) => {
            resolve(updatedUser)
        }, error => {
            reject(error)
        })
    })
}

exports.addNewMovie = data => {
    return new Promise((resolve, reject) => {
        let movie = new Movie({
            cast: data.cast,
            countries: data.countries,
            directors: data.directors,
            fullplot: data.fullplot,
            genres: data.genres,
            languages: data.languages,
            lastupdated: data.lastupdated,
            metacritic: data.metacritic,
            num_mflix_comments: data.num_mflix_comments,
            plot: data.plot,
            poster: data.poster,
            rated: data.rated,
            released: data.released,
            runtime: data.runtime,
            title: data.title,
            type: data.type,
            writers: data.writers,
            year: data.year,
        })

        movie.save().then((createdMovie) => {
            resolve(createdMovie)
        }, error => {
            reject(error)
        })
    })
}

exports.getAllMovies = (page, perPage, title) => {
    return new Promise((resolve, reject) => {
        if (!title) {
            Movie.find().limit(perPage).skip(perPage * (page - 1)).sort({'_id': 1}).exec().then((result) => {
                resolve(result)
            }, error => {
                reject(error)
            })
        } else {
            Movie.find({
                'title': {
                    $regex: title,
                    $options: 'i'
                }
            }).limit(perPage).skip(perPage * (page - 1)).sort({'_id': 1}).exec().then((result) => {
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
            cast: data.cast,
            countries: data.countries,
            directors: data.directors,
            fullplot: data.fullplot,
            genres: data.genres,
            languages: data.languages,
            lastupdated: data.lastupdated,
            metacritic: data.metacritic,
            num_mflix_comments: data.num_mflix_comments,
            plot: data.plot,
            poster: data.poster,
            rated: data.rated,
            released: data.released,
            runtime: data.runtime,
            title: data.title,
            type: data.type,
            writers: data.writers,
            year: data.year,
        }, {returnDocument: 'after'}).exec().then((updatedMovie) => {
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