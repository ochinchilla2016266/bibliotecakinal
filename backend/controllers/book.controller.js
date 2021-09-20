"use strict"

const Book = require("../models/book.model");
const User = require("../models/user.model");

function createBook(req, res) {

    var params = req.body;

    if (params.title && params.author && params.edition && params.key_words && params.description && params.topics && params.copies) {
        Book.findOne({ title: params.title }, (err, bookFinded) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (bookFinded) {
                return res.send({ message: "El título del libro ya está registrado" });
            } else {
                var book = new Book();
                book.title = params.title;
                book.author = params.author;
                book.edition = params.edition;
                book.key_words = params.key_words;
                book.description = params.description;
                book.topics = params.topics;
                book.copies = params.copies;
                book.available = params.copies;
                book.save((err, bookSaved) => {
                    if (err) {
                        return res.status(500).send({ message: "Error al guardar el libro" });
                    } else if (bookSaved) {
                        return res.send({ message: "Libro registrado exitosamente", bookSaved });
                    } else {
                        return res.status(500).send({ message: "Error al registrar el libro" });
                    }
                })
            }
        })
    } else {
        return res.send({ message: "Ingrese los datos mínimos" });
    }
}

function updateBook(req, res) {

    var update = req.body;
    let bookId = req.params.id;

    Book.findOne({ title: update.title }, (err, bookFinded) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar libro" });
        } else if (bookFinded) {
            var copies = update.copies - bookFinded.copies;
            var available = bookFinded.available + copies;
            if (bookFinded._id == bookId) {
                Book.findByIdAndUpdate(bookId, update, { new: true }, (err, bookUpdated) => {
                    if (err) {
                        return res.status(500).send({ message: "Error al actualizar libro" });
                    } else if (bookUpdated) {
                        Book.findByIdAndUpdate(bookId, { available: available }, { new: true }, (err, bookUpdated) => {
                            if (err) {
                                return res.status(500).send({ message: "Error al actualizar libro" });
                            } else if (bookUpdated) {
                                return res.send({ message: "Libro actualizado exitosamente", bookUpdated });
                            } else {
                                return res.status(500).send({ message: "No se actualizó" });
                            }
                        })
                    } else {
                        return res.status(500).send({ message: "No se actualizó" });
                    }
                })
            } else {
                return res.send({ message: "El título del libro ya se encuentra en uso" });
            }
        } else {
            Book.findById(bookId, (err, bookFinded) => {
                if (err) {
                    return res.status(500).send({ message: "Error al buscar libro" });
                } else if (bookFinded) {
                    var copies = update.copies - bookFinded.copies;
                    var available = bookFinded.available + copies;
                    Book.findByIdAndUpdate(bookId, update, { new: true }, (err, bookUpdated) => {
                        if (err) {
                            return res.status(500).send({ message: "Error al actualizar libro" });
                        } else if (bookUpdated) {
                            Book.findByIdAndUpdate(bookId, { available: available }, { new: true }, (err, bookUpdated) => {
                                if (err) {
                                    return res.status(500).send({ message: "Error al actualizar libro" });
                                } else if (bookUpdated) {
                                    return res.send({ message: "Libro actualizado exitosamente", bookUpdated });
                                } else {
                                    return res.status(500).send({ message: "No se actualizó" });
                                }
                            })
                        } else {
                            return res.status(500).send({ message: "No se actualizó" });
                        }
                    })
                } else {
                    return res.status(404).send({ message: "Libro inexistente" });
                }
            })
        }
    })
}

function removeBook(req, res) {

    let bookId = req.params.id;

    Book.findByIdAndRemove(bookId, (err, bookRemoved) => {
        if (err) {
            return res.status(500).send({ message: "Libro inexistente o ya fue eliminado" });
        } else if (bookRemoved) {
            return res.send({ message: "Libro eliminado exitosamente", bookRemoved });
        } else {
            return res.status(404).send({ message: "Libro inexistente o ya fue eliminado" });
        }
    })
}

function getBooks(req, res) {
    Book.find({}).exec((err, books) => {
        if (err) {
            return res.status(500).send({ message: "Error al obtener libros" });
        } else if (books) {
            return res.send({ message: "Libros", books });
        } else {
            return res.send({ message: "No hay libros registrados" });
        }
    })
}

function getBook(req, res) {
    let bookId = req.params.id;

    Book.findById(bookId, (err, book) => {
        if (err) {
            return res.status(500).send({ message: "Error al obtener libro" });
        } else if (book) {
            return res.send({ message: "Libro", book });
        } else {
            return res.send({ message: "Libro inexistente" });
        }
    })
}

function loanBook(req, res) {
    let bookId = req.params.id;
    let userId = req.user.sub;

    Book.findById(bookId, (err, bookFinded) => {
        if (err) {
            return res.status8500.send({ message: "Error al buscar libro" });
        } else if (bookFinded) {
            let available = bookFinded.available - 1;
            let countBook = bookFinded.count + 1;
            if (bookFinded.available == 0) {
                return res.send({ message: "Libro no disponible actualmente" });
            } else {
                User.findById(userId, (err, userFinded) => {
                    if (err) {
                        return res.status(500).send({ message: "Error al buscar usuario" });
                    } else if (userFinded) {
                        if (userFinded.books.includes(bookId) == true) {
                            return res.send({ message: "Ya tiene este libro" });
                        } else {
                            let count = userFinded.count + 1;
                            let booksCount = userFinded.books.length;
                            /* let booksCount = 0;
                            userFinded.books.forEach(element => {
                                booksCount = booksCount + 1;
                            }); */
                            if (booksCount == 10) {
                                return res.send({ message: "Solo se puede prestar un máximo de 10 libros, devuélva uno para poder prestar este libro" });
                            } else {
                                User.findByIdAndUpdate(userId, { $push: { books: bookId, history_books: bookId }, count: count }, { new: true }, (err, userUpdated) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error al agregar libro a su cuenta" });
                                    } else if (userUpdated) {
                                        Book.findByIdAndUpdate(bookId, { available: available, count: countBook }, { new: true }, (err, bookUpdated) => {
                                            if (err) {
                                                return res.status(500).send({ message: "Error al actualizar libro" });
                                            } else if (bookUpdated) {
                                                return res.send({ message: "Libro prestado exitosamente", userUpdated });
                                            } else {
                                                return res.status(500).send({ message: "No se actualizó" });
                                            }
                                        })
                                    } else {
                                        return res.status(500).send({ message: "No se pudo prestar el libro" });
                                    }
                                }).populate("books").populate("reviews").populate("history_books").populate("history_reviews");
                            }
                        }
                    } else {
                        return res.status(404).send({ message: "Usuario no logeado" });
                    }
                })
            }
        } else {
            return res.send({ message: "Libro inexistente" });
        }
    })
}

function returnBook(req, res) {
    let bookId = req.params.id;
    let userId = req.user.sub;

    Book.findById(bookId).exec((err, bookFinded) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar libro" });
        } else if (bookFinded) {
            User.findOneAndUpdate({ _id: userId, books: bookId }, { $pull: { books: bookId } }, { new: true }, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({ message: "Error al devolver libro" });
                } else if (userUpdated) {
                    let available = bookFinded.available + 1;
                    Book.findByIdAndUpdate(bookId, { available: available }, { new: true }, (err, bookUpdated) => {
                        if (err) {
                            return res.status(500).send({ message: "Error al actualizar libro" });
                        } else if (bookUpdated) {
                            return res.send({ message: "Libro devuelto exitosamente", userUpdated });
                        } else {
                            return res.status(500).send({ message: "No se devolvió el libro" });
                        }
                    })
                } else {
                    return res.status(404).send({ message: "No posee este libro" });
                }
            }).populate("books").populate("reviews").populate("history_books").populate("history_reviews");
        } else {
            return res.send({ message: "Libro inexistente" });
        }
    })
}

module.exports = {
    createBook,
    updateBook,
    removeBook,
    getBooks,
    getBook,
    loanBook,
    returnBook
}