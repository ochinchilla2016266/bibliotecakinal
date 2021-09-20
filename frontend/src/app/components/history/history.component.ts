import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  user: any;
  book: Book;
  books: Array<Book> = [];
  type: string = "Libros";
  review: Review;
  reviews: Array<Review> = [];

  constructor() { 
    this.book = new Book("","","",0,[],"",[],0,0,0);
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.books = this.user.history_books;
    this.reviews = this.user.history_reviews;
    console.log(this.books);
    console.log(this.reviews);
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

}
