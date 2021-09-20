"use strict";

const express = require("express");
const reviewController = require("../controllers/review.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/createReview", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], reviewController.createReview);
api.put("/updateReview/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], reviewController.updateReview);
api.delete("/removeReview/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], reviewController.removeReview);
api.get("/getReviews", [mdAuth.ensureAuth], reviewController.getReviews);
api.get("/getReview/:id", [mdAuth.ensureAuth], reviewController.getReview);
api.put("/loanReview/:id", [mdAuth.ensureAuth], reviewController.loanReview);
api.put("/returnReview/:id", [mdAuth.ensureAuth], reviewController.returnReview);

module.exports = api;