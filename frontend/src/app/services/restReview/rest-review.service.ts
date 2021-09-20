import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestReviewService {

  public uri:string;
  public user:any;
  public token:any;
  public role:any;
  public username:any;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  };

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  constructor(private http: HttpClient) { 
    this.uri = CONNECTION.URI;
  }

  getToken(){
    let token = localStorage.getItem('token')!;
    this.token = token;
    
    return token;
  }

  getReviews(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get<any>(`${this.uri}getReviews`, {headers: headers}).pipe(map(this.extractData))
  }

  createReview(review: any){
    let params = JSON.stringify(review);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.post<any>(`${this.uri}createReview`, params, {headers: headers}).pipe(map(this.extractData))
  }

  updateReview(review: any){
    let params = JSON.stringify(review);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}updateReview/${review._id}`, params, {headers: headers}).pipe(map(this.extractData))
  }

  deleteReview(reviewId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.delete<any>(`${this.uri}removeReview/${reviewId}`, {headers: headers}).pipe(map(this.extractData))
  }

  loanReview(reviewId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}loanReview/${reviewId}`,[], {headers: headers}).pipe(map(this.extractData))
  }

  returnReview(reviewId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}returnReview/${reviewId}`,[], {headers: headers}).pipe(map(this.extractData))
  }
}
