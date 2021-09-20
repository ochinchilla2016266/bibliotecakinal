"use strict";

const express = require("express");
const userController = require("../controllers/user.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/register", userController.register);
api.post("/login", userController.login);
api.put("/updateUser/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.updateUser);
api.delete("/removeUser/:id",[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.removeUser);
api.get("/getUsers", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);
api.get("/getUser/:id", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUser);

module.exports = api;