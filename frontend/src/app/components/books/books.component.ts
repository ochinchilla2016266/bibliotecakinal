import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { RestBookService } from 'src/app/services/restBook/rest-book.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  book: Book;
  books: Array<Book> = [];
  user: any;
  key_words: string = "";
  topics: string = "";
  order: string = "Ascendente";
  orderType: string = "copies";
  search = "";
  type = "Título";

  constructor(private restBook: RestBookService) {
    this.book = new Book("", "", "", 0, [], "", [], 0, 0, 0);
    this.user = JSON.parse(localStorage.getItem("user")!);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.restBook.getBooks().subscribe((resp: any) => {
      if (resp.books) {
        this.books = resp.books;
        localStorage.setItem("books", JSON.stringify(resp.books));
      } else {
        alert(resp.message);
      }
    },
      (error) => {
        alert(error.error.message);
      })
  }

  onSubmit(bookForm: NgForm) {
    this.book.key_words = this.key_words.split(",");
    this.book.topics = this.topics.split(",");
    let book: any = this.book;
    delete book.available;
    this.restBook.createBook(book).subscribe((resp: any) => {
      if (resp.bookSaved) {
        bookForm.reset();
        this.books.push(resp.bookSaved);
        localStorage.setItem("books", JSON.stringify(this.books));
        alert("Libro agregado exitosamente");
      } else {
        alert(resp.message);
      }
    },
      (error) => {
        alert(error.error.message);
      })
  }

  setBookInfo(book: any) {
    this.book = book;
    this.key_words = book.key_words.toString();
    this.topics = book.topics.toString();
  }

  deleteBookInfo() {
    this.book = new Book("", "", "", 0, [], "", [], 0, 0, 0);
  }

  updateBook(updateBookForm: NgForm) {
    this.book.key_words = this.key_words.split(",");
    this.book.topics = this.topics.split(",");
    let book: any = this.book;
    delete book.available;
    this.restBook.updateBook(book).subscribe((resp: any) => {
      if (resp.bookUpdated) {
        updateBookForm.reset();
        this.book = new Book("", "", "", 0, [], "", [], 0, 0, 0);
        alert("Libro actualizado exitosamente");
        this.ngOnInit();
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: resp.message
        })
      }
    },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: error.error.message
        })
      })
  }

  deleteBook(book: any) {
    this.setBookInfo(book);
    let bookToDelete: any = this.book;
    Swal.fire({
      title: "¿Eliminar libro " + bookToDelete.title + " ?",
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
      .then(resultado => {
        if (resultado.value) {
          this.restBook.deleteBook(this.book._id).subscribe((resp: any) => {
            if (resp.bookRemoved) {
              alert("Libro eliminado exitosamente");
              this.ngOnInit();
              this.book = new Book("", "", "", 0, [], "", [], 0, 0, 0);
            } else {
              alert(resp.message);
            }
          },
            (error: any) => {
              alert(error.error.message);
            })
        } else {
          this.deleteBookInfo();
        }
      });
  }

  loanBook(book: any) {
    Swal.fire({
      title: "Desea adquirir el libro " + book.title + " ?",
      text: "Prestar el libro " + book.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, adquirir",
      cancelButtonText: "Cancelar",
    })
      .then(resultado => {
        if (resultado.value) {
          this.restBook.loanBook(book._id).subscribe((resp: any) => {
            if (resp.userUpdated) {
              alert("Libro adquirido exitosamente");
              localStorage.setItem("user", JSON.stringify(resp.userUpdated));
              this.ngOnInit();
            } else {
              alert(resp.message);
            }
          },
            (error: any) => {
              alert(error.error.message);
            })
        } else {
          this.deleteBookInfo();
        }
      });
  }

  ngDoCheck() {
    this.books = JSON.parse(localStorage.getItem("books")!);
  }
}
