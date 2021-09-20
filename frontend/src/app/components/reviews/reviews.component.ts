import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Review } from 'src/app/models/review';
import { RestReviewService } from 'src/app/services/restReview/rest-review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  review: Review;
  reviews: Array<Review> = [];
  user: any;
  key_words: string = "";
  topics: string = "";
  order: string = "Ascendente";
  orderType: string = "copies";
  search = "";
  type = "Título";

  constructor(private restReview: RestReviewService) { 
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
    this.user = JSON.parse(localStorage.getItem("user")!);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.restReview.getReviews().subscribe((resp:any)=>{
      if(resp.reviews){
        this.reviews = resp.reviews;
        localStorage.setItem("reviews",JSON.stringify(resp.reviews));
      }else{
        alert(resp.message);
      }
    },
    (error)=>{
      alert(error.error.message);
    })
  }

  onSubmit(reviewForm: NgForm){
    this.review.key_words = this.key_words.split(",");
    this.review.topics = this.topics.split(",");
    let review: any = this.review;
    delete review.available;
    this.restReview.createReview(review).subscribe((resp:any)=>{
      if(resp.reviewSaved){
        reviewForm.reset();
        this.reviews.push(resp.reviewSaved);
        localStorage.setItem("reviews",JSON.stringify(this.reviews));
        alert("Revista agregada exitosamente");
      }else{
        alert(resp.message);
      }
    },
    (error)=>{
      alert(error.error.message);
    })
  }

  setReviewInfo(review:any){
    this.review = review;
    this.key_words = review.key_words.toString();
    this.topics = review.topics.toString();
  }

  deleteReviewInfo(){
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
  }

  updateReview(updateReviewForm: NgForm){
    this.review.key_words = this.key_words.split(",");
    this.review.topics = this.topics.split(",");
    let review: any = this.review;
    delete review.available;
    this.restReview.updateReview(review).subscribe((resp:any)=>{
      if(resp.reviewUpdated){
        updateReviewForm.reset();
        this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
        alert("Revista actualizada exitosamente");
        this.ngOnInit();
      }else{
        alert(resp.message);
      }
    },
    (error)=>{
        alert(error.error.message);
    })
  }

  deleteReview(review: any){
    this.setReviewInfo(review);
    let reviewToDelete:any = this.review;
    Swal.fire({
      title: "¿Eliminar revista " + reviewToDelete.title + " ?" ,
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restReview.deleteReview(review._id).subscribe((resp:any)=>{
            if(resp.reviewRemoved){
              alert("Revista eliminada exitosamente");
              this.ngOnInit();
              this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
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

  loanReview(review: any){
    Swal.fire({
      title: "Desea adquirir la revista " + review.title + " ?" ,
      text: "Prestar la revista " + review.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, adquirir",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restReview.loanReview(review._id).subscribe((resp:any)=>{
            if(resp.userUpdated){
              alert("Revista adquirida exitosamente");
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

  ngDoCheck(){
    this.reviews = JSON.parse(localStorage.getItem("reviews")!);
  }

}
