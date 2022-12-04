// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
CriticSchema = new Schema({
    rating : { type: Number } ,
    numReviews : { type: Number } ,
    meter : { type: Number }
})
module.exports = CriticSchema