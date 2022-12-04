// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
ImdbSchema = new Schema({
    rating : { type: Number } ,
    votes : { type: Number } ,
    id : { type: Number }
})
module.exports = ImdbSchema