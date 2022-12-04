// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
AwardsSchema = new Schema({
    wins : { type: Number } ,
    nominations : { type: Number } ,
    text : { type: String }
})
module.exports = AwardsSchema