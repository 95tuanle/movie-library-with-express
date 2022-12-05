// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
UserSchema = new Schema({
    username : { type: String } ,
    password : { type: String } ,
    token : { type: String } ,
})
module.exports = UserSchema