import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Review } from 'src/app/models/review';
import { RestBookService } from 'src/app/services/restBook/rest-book.service';
import { RestReviewService } from 'src/app/services/restReview/rest-review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books-reviews',
  templateUrl: './books-reviews.component.html',
  styleUrls: ['./books-reviews.component.css']
})
export class BooksReviewsComponent implements OnInit {

  user: any;
  book: Book;
  books: Array<Book> = [];
  type: string = "Libros";
  review: Review;
  reviews: Array<Review> = [];

  constructor(private restBook: RestBookService, private restReview: RestReviewService) { 
    this.book = new Book("","","",0,[],"",[],0,0,0);
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.books = this.user.books;
    this.reviews = this.user.reviews;
  }

  setBookInfo(book:any){
    this.book = book;
  }

  deleteBookInfo(){
    this.book = new Book("","","",0,[],"",[],0,0,0);
  }

  setReviewInfo(review:any){
    this.review = review;
  }

  deleteReviewInfo(){
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
  }

  returnBook(book: any){
    Swal.fire({
      title: "Desea retornar el libro " + book.title + " ?" ,
      text: "Regresar el libro " + book.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, devovler",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restBook.returnBook(book._id).subscribe((resp:any)=>{
            if(resp.userUpdated){
              alert("Libro devuelto exitosamente");
              localStorage.setItem("user", JSON.stringify(resp.userUpdated));
              this.ngOnInit();
            }else{
              alert(resp.message);
            }
          },
           (error:any)=>{
            alert(error.error.message);
          })
        }else {
          this.deleteBookInfo();
        }
    });
  }

  returnReview(review: any){
    Swal.fire({
      title: "Desea retornar la revista " + review.title + " ?" ,
      text: "Regresar la Revista " + review.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, devovler",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restReview.returnReview(review._id).subscribe((resp:any)=>{
            if(resp.userUpdated){
              alert("Revista devuelta exitosamente");
              localStorage.setItem("user", JSON.stringify(resp.userUpdated));
              this.ngOnInit();
            }else{
              alert(resp.message);
            }
          },
           (error:any)=>{
            alert(error.error.message);
          })
        }else {
          this.deleteReviewInfo();
        }
    });
  }

}
