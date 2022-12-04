// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CriticSchema = require("./critic-schema");
const ViewerSchema = require("./viewer-schema");
TomatoesSchema = new Schema({
    boxOffice: { type: String } ,
    consensus: { type: String } ,
    critic: {
        type: CriticSchema
        // rating : { type: Number } ,
        // numReviews : { type: Number } ,
        // meter : { type: Number }
    } ,
    dvd : { type: Date } ,
    fresh : { type: Number } ,
    rotten : { type: Number } ,
    production : { type: String } ,
    website : { type: String } ,
    viewer : {
        type: ViewerSchema
        // rating : { type: Number } ,
        // numReviews : { type: Number } ,
        // meter : { type: Number }
    } ,
    lastUpdated : { type: Date }
})
module.exports = TomatoesSchema