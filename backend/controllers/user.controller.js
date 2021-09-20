"use strict"

const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

const User = require("../models/user.model");

function userAdmin() {
    var user = new User();

    User.findOne({ username: "adminpractica" }, (err, adminFinded) => {
        if (err) {
            console.log(err);
        } else if (adminFinded) {
            console.log("Usuario admin ya fue creado");
        } else {
            bcrypt.hash("adminpractica", null, null, (err, passwordHashed) => {
                if (err) {
                    console.log("Error al encriptar contraseña de admin");
                } else if (passwordHashed) {
                    user.password = passwordHashed;
                    user.name = "adminpractica";
                    user.username = "adminpractica";
                    user.role = "ROLE_ADMIN";
                    user.save((err, userSaved) => {
                        if (err) {
                            console.log("Error al crear usuario admin");
                        } else if (userSaved) {
                            console.log("Usuario admin creado exitosamente");
                        } else {
                            console.log("No se creó el usuario admin");
                        }
                    });
                } else {
                    console.log("Contraseña de admin no encriptada");
                }
            });
        }
    });
}

function register(req, res) {
    var user = new User();
    var params = req.body;

    if (params.id && params.name && params.username && params.password && params.email && params.phone && params.lastname) {
        User.findOne({ username: params.username }, (err, userFinded) => {
            if (err) {
                return res.status(500).send({ message: "Error al buscar usuario" });
            } else if (userFinded) {
                return res.send({ message: "Nombre de usuario ya utilizado" });
            } else {
                User.findOne({ id: params.id }, (err, userFinded)=>{
                    if(err){
                        return res.status(500).send({ message: "Error al buscar usuario" });
                    }else if(userFinded){
                        return res.send({ message: "Carné ya utilizado" });
                    }else{
                        bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ message: "Error al encriptar contraseña" });
                            } else if (passwordHashed) {
                                user.id = params.id;
                                user.password = passwordHashed;
                                user.name = params.name;
                                user.lastname = params.lastname;
                                user.username = params.username;
                                user.email = params.email;
                                user.phone = params.phone;
                                if(params.role){
                                    user.role = params.role;
                                }
                                user.save((err, userSaved) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ message: "Error al guardar usuario" });
                                    } else if (userSaved) {
                                        return res.send({
                                            message: "Usuario agregado exitosamente",
                                            userSaved,
                                        });
                                    } else {
                                        return res
                                            .status(500)
                                            .send({ message: "No se guardó el usuario" });
                                    }
                                });
                            } else {
                                return res
                                    .status(401)
                                    .send({ message: "Contraseña no encriptada" });
                            }
                        });
                    }
                })
            }
        });
    } else {
        return res.send({ message: "Ingrese los datos mínimos" });
    }
}

function login(req, res){
    var params = req.body;
    
    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la verificación de la contraseña'});
                    }else if(checkPassword){
                        if(params.gettoken){
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            return res.send({ message: 'Usuario logeado', user:userFind});
                        }
                    }else{
                        return res.status(401).send({message: 'Contrasea incorrecta'});
                    }
                })
            }else{
                return res.send({message: 'El usuario no existe, comuníquese con el administrador para solicitar su registro'});
            }
        }).populate("reviews").populate("books").populate("history_books").populate("history_reviews");
    }else{
        return res.status(401).send({message: 'Por favor ingresa los datos obligatorios'});
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub && req.user.role == "ROLE_USER"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password){
            return res.status(401).send({ message: 'No se puede actualizar la contraseña'});
        }else{
            User.findOne({username: update.username}, (err, userFind)=>{
                if(err){
                    return res.status(500).send({ message: 'Error general'});
                }else if(userFind){
                    if(userFind._id == userId){
                        User.findOne({id: update.id},(err,userFinded)=>{
                            if(err){
                                return res.status(500).send({message: "Error general"});
                            }else if(userFinded){
                                if(userFind.id == update.id){
                                    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al actualizar'});
                                        }else if(userUpdated){
                                            return res.send({message: 'Usuario actualizado', userUpdated});
                                        }else{
                                            return res.send({message: 'No se pudo actualizar al usuario'});
                                        }
                                    })
                                }else{
                                    return res.send({message: "Carné/CUI ya existente"});
                                }
                            }else{
                                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'});
                                    }else if(userUpdated){
                                        return res.send({message: 'Usuario actualizado', userUpdated});
                                    }else{
                                        return res.send({message: 'No se pudo actualizar al usuario'});
                                    }
                                })
                            }
                        })
                    }else{
                        return res.send({message: "Nombre de usuario ya en uso"});
                    }
                }else{
                    User.findOne({id: update.id},(err,userFinded)=>{
                        if(err){
                            return res.status(500).send({message: "Error general"});
                        }else if(userFinded){
                            if(userFind.id == update.id){
                                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'});
                                    }else if(userUpdated){
                                        return res.send({message: 'Usuario actualizado', userUpdated});
                                    }else{
                                        return res.send({message: 'No se pudo actualizar al usuario'});
                                    }
                                })
                            }else{
                                return res.send({message: "Carné/CUI ya existente"});
                            }
                        }else{
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub && req.user.role == "ROLE_USER"){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        User.findOne({_id: userId}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al eliminar'});
            }else if(userFind){
                User.findByIdAndRemove(userId, (err, userRemoved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al eliminar'});
                    }else if(userRemoved){
                        return res.send({message: 'Usuario eliminado', userRemoved});
                    }else{
                        return res.status(403).send({message: 'Usuario no eliminado'});
                    }
                })
            }else{
                return res.status(403).send({message: 'Usuario no eliminado'});
            } 
        })
    }
}

function getUsers(req,res){
    User.find({}).exec((err,users)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener usuarios"});
        }else if(users){
            return res.send({message: "Usuarios", users});
        }else{
            return res.send({message: "No hay usuarios"});
        }
    })
}

function getUser(req,res){
    let userId = req.params.id;

    User.findById(userId,(err,user)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener usuario"});
        }else if(user){
            return res.send({message: "Usuario", user});
        }else{
            return res.send({message: "Usuario inexistente"});
        }
    })
}

module.exports = {
    userAdmin,
    register,
    login,
    updateUser,
    removeUser,
    getUsers,
    getUser
}