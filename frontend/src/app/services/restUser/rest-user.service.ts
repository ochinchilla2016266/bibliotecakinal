import { Injectable } from '@angular/core';
import { CONNECTION } from '../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestUserService {

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

  login(user: any){
    user.gettoken = "true";
    let params = JSON.stringify(user);
    return this.http.post<any>(`${this.uri}login`, params, this.httpOptions).pipe(map(this.extractData))
  }

  getUsers(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get<any>(`${this.uri}getUsers`, {headers: headers}).pipe(map(this.extractData))
  }

  register(user: any){
    let params = JSON.stringify(user);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.post<any>(`${this.uri}register`, params, {headers: headers}).pipe(map(this.extractData))
  }

  updateUser(user: any){
    let params = JSON.stringify(user);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put<any>(`${this.uri}updateUser/${user._id}`, params, {headers: headers}).pipe(map(this.extractData))
  }

  deleteUser(userId: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.delete<any>(`${this.uri}removeUser/${userId}`, {headers: headers}).pipe(map(this.extractData))
  }
}
