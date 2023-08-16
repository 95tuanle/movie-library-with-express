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
// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AwardsSchema = require("./awards-schema")
const ImdbSchema = require("./imdb-schema")
const TomatoesSchema = require("./tomatoes-schema")
MovieSchema = new Schema({
    cast: [{type: String}],
    countries: [{type: String}],
    directors: [{type: String}],
    fullplot: {type: String},
    genres: [{type: String}],
    languages: [{type: String}],
    lastupdated: {type: String},
    metacritic: {type: Number},
    num_mflix_comments: {type: Number},
    plot: {type: String},
    poster: {type: String},
    rated: {type: String},
    released: {type: Date},
    runtime: {type: Number},
    title: {type: String},
    type: {type: String},
    writers: [{type: String}],
    year: {type: Number},
    awards: {
        type: AwardsSchema
        // wins : { type: Number } ,
        // nominations : { type: Number } ,
        // text : { type: String }
    },
    imdb: {
        type: ImdbSchema
        // rating : { type: Number } ,
        // votes : { type: Number } ,
        // id : { type: Number }
    },
    tomatoes: {
        type: TomatoesSchema
        // boxOffice: { type: String } ,
        // consensus: { type: String } ,
        // critic: {
        //     rating : { type: Number } ,
        //     numReviews : { type: Number } ,
        //     meter : { type: Number }
        // } ,
        // dvd : { type: Date } ,
        // fresh : { type: Number } ,
        // rotten : { type: Number } ,
        // production : { type: String } ,
        // website : { type: String } ,
        // viewer : {
        //     rating : { type: Number } ,
        //     numReviews : { type: Number } ,
        //     meter : { type: Number }
        // } ,
        // lastUpdated : { type: Date }
    }
})
module.exports = MovieSchema