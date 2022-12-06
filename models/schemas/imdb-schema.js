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
ImdbSchema = new Schema({
    rating : { type: Number } ,
    votes : { type: Number } ,
    id : { type: Number }
})
module.exports = ImdbSchema