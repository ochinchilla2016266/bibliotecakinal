'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = Schema({
    author: String,
    title: String,
    edition: Number,
    key_words: [String],
    description: String,
    topics: [String],
    copies: Number,
    available: Number,
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('book', bookSchema);