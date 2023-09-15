const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    date: String,
    note: String,
    title: String,
})

const Data = mongoose.model('data', noteSchema)

module.exports = Data;