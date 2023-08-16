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
require('dotenv').config()
module.exports = {
    url_atlas: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
}