'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    id: Number,
    name: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
    count: {type: Number, default: 0},
    role: {type: String, default: "ROLE_USER"},
    books: [{type: Schema.ObjectId, ref: 'book'}],
    reviews: [{type: Schema.ObjectId, ref: 'review'}],
    history_books: [{type: Schema.ObjectId, ref: 'book'}],
    history_reviews: [{type: Schema.ObjectId, ref: 'review'}]
});

module.exports = mongoose.model('user', userSchema);