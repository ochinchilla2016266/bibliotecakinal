"use strict";

const express = require("express");
const bookController = require("../controllers/book.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/createBook", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bookController.createBook);
api.put("/updateBook/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bookController.updateBook);
api.delete("/removeBook/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bookController.removeBook);
api.get("/getBooks",[mdAuth.ensureAuth], bookController.getBooks);
api.get("/getBook/:id",[mdAuth.ensureAuth], bookController.getBook);
api.put("/loanBook/:id",[mdAuth.ensureAuth], bookController.loanBook);
api.put("/returnBook/:id",[mdAuth.ensureAuth], bookController.returnBook);

module.exports = api;