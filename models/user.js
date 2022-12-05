// load mongoose since we need it to define a model
const mongoose = require('mongoose')
const UserSchema = require('./schemas/user-schema')
module.exports = mongoose.model('User', UserSchema, 'managedUsers')