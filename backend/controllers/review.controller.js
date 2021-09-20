"use strict"

const Review = require("../models/review.model");
const User = require("../models/user.model");

function createReview(req,res){

    var params = req.body;

    if(params.title && params.author && params.edition && params.key_words && params.description && params.topics && params.copies && params.frequency && params.examples){
        Review.findOne({title: params.title},(err,reviewFinded)=>{
            if(err){
                return res.status(500).send({message: "Error general"});
            }else if(reviewFinded){
                return res.send({message: "El título de la revista ya está registrado"});
            }else{
                var review = new Review();
                review.title = params.title;
                review.author = params.author;
                review.edition = params.edition;
                review.key_words = params.key_words;
                review.description = params.description;
                review.topics = params.topics;
                review.copies = params.copies;
                review.available = params.copies;
                review.frequency = params.frequency;
                review.examples = params.examples;
                review.save((err,reviewSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al guardar el revista"});
                    }else if(reviewSaved){
                        return res.send({message: "Revista registrada exitosamente", reviewSaved});
                    }else{
                        return res.status(500).send({message: "Error al registrar el revista"});
                    }
                })
            }
        })
    }else{
        return res.send({message: "Ingrese los datos mínimos"});
    }
}

function updateReview(req,res){

    var update = req.body;
    let reviewId = req.params.id;

    Review.findOne({title: update.title},(err,reviewFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar revista"});
        }else if(reviewFinded){
            var copies = update.copies - reviewFinded.copies;
            var available = reviewFinded.available + copies;
            if(reviewFinded._id == reviewId){
                Review.findByIdAndUpdate(reviewId,update,{new: true},(err,reviewUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al actualizar revista"});
                    }else if(reviewUpdated){
                        Review.findByIdAndUpdate(reviewId,{available: available},{new: true},(err,reviewUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al actualizar revista"});
                            }else if(reviewUpdated){
                                return res.send({message: "Revista actualizada exitosamente", reviewUpdated});
                            }else{
                                return res.status(500).send({message: "No se actualizó"});
                            }
                        })
                    }else{
                        return res.status(500).send({message: "No se actualizó"});
                    }
                })
            }else{
                return res.send({message: "El título de la revista ya se encuentra en uso"});
            }
        }else{
            Review.findById(reviewId,(err,reviewFinded)=>{
                if(err){
                    return res.status(500).send({message: "Error al buscar revista"});
                }else if(reviewFinded){
                    var copies = update.copies - reviewFinded.copies;
                    var available = reviewFinded.available + copies;
                    Review.findByIdAndUpdate(reviewId,update,{new: true},(err,reviewUpdated)=>{
                        if(err){
                            return res.status(500).send({message: "Error al actualizar revista"});
                        }else if(reviewUpdated){
                            Review.findByIdAndUpdate(reviewId,{available: available},{new: true},(err,reviewUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: "Error al actualizar revista"});
                                }else if(reviewUpdated){
                                    return res.send({message: "Revista actualizada exitosamente", reviewUpdated});
                                }else{
                                    return res.status(500).send({message: "No se actualizó"});
                                }
                            })
                        }else{
                            return res.status(500).send({message: "No se actualizó"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "Revista inexistente"});
                }
            })
        }
    })
}

function removeReview(req,res){

    let reviewId = req.params.id;

    Review.findByIdAndRemove(reviewId,(err,reviewRemoved)=>{
        if(err){
            return res.status(500).send({message: "Revista inexistente o ya fue eliminada"});
        }else if(reviewRemoved){
            return res.send({message: "Revista eliminada exitosamente", reviewRemoved});
        }else{
            return res.status(404).send({message: "Revista inexistente o ya fue eliminada"});
        }
    })
}

function getReviews(req,res){
    Review.find({}).exec((err,reviews)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener revistas"});
        }else if(reviews){
            return res.send({message: "Revistas", reviews});
        }else{
            return res.send({message: "No hay revistas registrados"});
        }
    })
}

function getReview(req,res){
    let reviewId = req.params.id;

    Review.findById(reviewId,(err,review)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener revista"});
        }else if(review){
            return res.send({message: "Revista", review});
        }else{
            return res.send({message: "Revista inexistente"});
        }
    })
}

function loanReview(req,res){
    let reviewId = req.params.id;
    let userId = req.user.sub;

    Review.findById(reviewId, (err,reviewFinded)=>{
        if(err){
            return res.status8500.send({message: "Error al buscar revista"});
        }else if(reviewFinded){
            let countReview = reviewFinded.count + 1;
            let available = reviewFinded.available - 1;
            if(reviewFinded.available == 0){
                return res.send({message: "Revista no disponible actualmente"});
            }else{
                User.findById(userId,(err,userFinded)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar usuario"});
                    }else if(userFinded){
                        let count = userFinded.count + 1;
                        if(userFinded.reviews.includes(reviewId) == true){
                            return res.send({message: "Ya tiene esta revista"});
                        }else{
                            let reviewCount = userFinded.reviews.length;
                            if(reviewCount == 10){
                                return res.send({message: "Solo se puede prestar un máximo de 10 revistas, devuélva una para poder prestar esta revista"});
                            }else{
                                User.findByIdAndUpdate(userId,{$push: {reviews: reviewId, history_reviews: reviewId}, count: count}, {new: true}, (err, userUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al agregar revista a su cuenta"});
                                    }else if(userUpdated){
                                        Review.findByIdAndUpdate(reviewId,{available: available, count: countReview},{new:true},(err, reviewUpdated)=>{
                                            if(err){
                                                return res.status(500).send({message: "Error al actualizar revista"});
                                            }else if(reviewUpdated){
                                                return res.send({message: "Revista prestada exitosamente", userUpdated});
                                            }else{
                                                return res.status(500).send({message: "No se actualizó"});
                                            }
                                        })
                                    }else{
                                        return res.status(500).send({message: "No se pudo prestar la revista"});
                                    }
                                }).populate("reviews").populate("books").populate("history_books").populate("history_reviews");
                            }
                        }
                    }else{
                        return res.status(404).send({message: "Usuario no logeado"});
                    }
                })
            }
        }else{
            return res.send({message: "Revista inexistente"});
        }
    })
}

function returnReview(req,res){
    let reviewId = req.params.id;
    let userId = req.user.sub;

    Review.findById(reviewId).exec((err, reviewFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar revista"});
        }else if(reviewFinded){
            User.findOneAndUpdate({_id: userId, reviews: reviewId},{$pull:{reviews: reviewId}},{new:true},(err, userUpdated)=>{
                if(err){
                    return res.status(500).send({message: "Error al devolver revista"});
                }else if(userUpdated){
                    let available = reviewFinded.available + 1;
                    Review.findByIdAndUpdate(reviewId, {available: available}, {new: true},(err, reviewUpdated)=>{
                        if(err){
                            return res.status(500).send({message: "Error al actualizar revista"});
                        }else if(reviewUpdated){
                            return res.send({message: "Revista devuelta exitosamente", userUpdated});
                        }else{
                            return res.status(500).send({message: "No se devolvió la revista"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "No posee esta revista"});
                }
            }).populate("reviews").populate("books").populate("history_books").populate("history_reviews");
        }else{
            return res.send({message: "Revista inexistente"});
        }
    })
}

module.exports = {
    createReview,
    updateReview,
    removeReview,
    getReviews,
    getReview,
    loanReview,
    returnReview
}