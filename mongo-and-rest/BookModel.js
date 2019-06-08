const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.Types;

const authorSchema = new Schema({
    name: {type: String, required: true}
});

const bookSchema = new Schema({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    language: {type: String, required: true},
    authors: {type: [authorSchema], required: true},
    pages: {type: Number, required: true},
});

module.exports = mongoose.model("Book", bookSchema);