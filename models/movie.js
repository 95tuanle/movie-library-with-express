// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
MovieSchema = new Schema({
    cast : [{ type: String }] ,
    countries : [{ type: String }] ,
    directors : [{ type: String }] ,
    fullplot : { type: String } ,
    genres : [{ type: String }] ,
    languages : [{ type: String }] ,
    lastupdated : { type: String } ,
    metacritic : { type: Number } ,
    num_mflix_comments : { type: Number } ,
    plot : { type: String } ,
    poster : { type: String } ,
    rated : { type: String } ,
    released : { type: Date } ,
    runtime : { type: Number } ,
    title : { type: String } ,
    type : { type: String } ,
    writers : [{ type: String }] ,
    year : { type: Number } ,
    awards : {
        wins : { type: Number } ,
        nominations : { type: Number } ,
        text : { type: String }
    } ,
    imdb : {
        rating : { type: Number } ,
        votes : { type: Number } ,
        id : { type: Number }
    } ,
    tomatoes : {
        boxOffice: { type: String } ,
        consensus: { type: String } ,
        critic: {
            rating : { type: Number } ,
            numReviews : { type: Number } ,
            meter : { type: Number }
        } ,
        dvd : { type: Date } ,
        fresh : { type: Number } ,
        rotten : { type: Number } ,
        production : { type: String } ,
        website : { type: String } ,
        viewer : {
            rating : { type: Number } ,
            numReviews : { type: Number } ,
            meter : { type: Number }
        } ,
        lastUpdated : { type: Date }
    } ,
})
module.exports = mongoose.model('Movie', MovieSchema)