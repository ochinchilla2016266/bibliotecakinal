import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestBookService {

  public uri:string;
  public user:any;
  public token:any;
  public role:any;
  public username:any;

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
    
    return this.token;
  }

  getBooks(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get<any>(`${this.uri}getBooks`, {headers: headers}).pipe(map(this.extractData))
  }

  createBook(book:any){
    let params = JSON.stringify(book);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.post<any>(`${this.uri}createBook`,params, {headers: headers}).pipe(map(this.extractData))
  }

  updateBook(book:any){
    let params = JSON.stringify(book);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}updateBook/${book._id}`,params, {headers: headers}).pipe(map(this.extractData))
  }

  deleteBook(bookId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.delete<any>(`${this.uri}removeBook/${bookId}`, {headers: headers}).pipe(map(this.extractData))
  }

  loanBook(bookId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}loanBook/${bookId}`,[], {headers: headers}).pipe(map(this.extractData))
  }

  returnBook(bookId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}returnBook/${bookId}`,[], {headers: headers}).pipe(map(this.extractData))
  }
}
