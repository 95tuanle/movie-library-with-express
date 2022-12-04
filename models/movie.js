// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const MovieSchema = require('./schemas/movie-schema')
module.exports = mongoose.model('Movie', MovieSchema)