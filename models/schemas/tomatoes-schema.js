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
const CriticSchema = require("./critic-schema")
const ViewerSchema = require("./viewer-schema")
TomatoesSchema = new Schema({
    boxOffice: {type: String},
    consensus: {type: String},
    critic: {
        type: CriticSchema
        // rating : { type: Number } ,
        // numReviews : { type: Number } ,
        // meter : { type: Number }
    },
    dvd: {type: Date},
    fresh: {type: Number},
    rotten: {type: Number},
    production: {type: String},
    website: {type: String},
    viewer: {
        type: ViewerSchema
        // rating : { type: Number } ,
        // numReviews : { type: Number } ,
        // meter : { type: Number }
    },
    lastUpdated: {type: Date}
})
module.exports = TomatoesSchema