import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BiblioKinal';
  token = localStorage.getItem("token");
  user: any;
  role = null;

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
    this.token = localStorage.getItem('token');
    if(this.user != null){
      this.role = this.user.role;
    }else{
      this.role = null;
    }
  }

  ngDoCheck(){
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
    this.token = localStorage.getItem('token');
    if(this.user != null){
      this.role = this.user.role;
    }else{
      this.role = null;
    }
  }

  ngOnChanges(){
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
    this.token = localStorage.getItem('token');
    if(this.user != null){
      this.role = this.user.role;
    }else{
      this.role = null;
    }
  }
}
