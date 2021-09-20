'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const userRoutes = require("./routes/user.route");
const bookRoutes = require("./routes/book.route");
const reviewRoutes = require("./routes/review.route");

var app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', reviewRoutes);

module.exports = app;