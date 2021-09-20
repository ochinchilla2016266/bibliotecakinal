import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Book } from 'src/app/models/book';
import { Review } from 'src/app/models/review';
import { User } from 'src/app/models/user';
import { RestBookService } from 'src/app/services/restBook/rest-book.service';
import { RestReviewService } from 'src/app/services/restReview/rest-review.service';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  users: Array<User> = [];
  book: Book;
  books: Array<Book> = [];
  review: Review;
  reviews: Array<Review> = [];

  order: string = 'desc';
  type: string = "Usuarios que más han prestado";

  constructor(private restUser: RestUserService, private restBook: RestBookService, private restReview: RestReviewService) { 
    this.user = new User("",0,"","","","","",0,"",[],[],[],[],0);
    this.book = new Book("","","",0,[],"",[],0,0,0);
    this.review = new Review("","","",0,[],"",[],0,0,"",0,0);
  }

  ngOnInit(): void {
    this.restUser.getUsers().subscribe((resp: any) => {
      this.users = resp.users
      let dataForGraphics: Array<number>= [];
      resp.users.forEach((user:any) => {
        if(user.count != 0){
          this.pieChartLabels.push(user.username);
          this.pieChartData.push(user.count);
        }
      });
      if(this.pieChartData.length != 0){
        for (let iterator = 0; iterator < this.pieChartData.length; iterator++) {
          this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
        }
      }
    })
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value:any, ctx:any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors: any[] = [
    {
      backgroundColor : []
    },
  ];

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public getRandomColor(): any {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  onChange(){
    this.pieChartOptions = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        datalabels: {
          formatter: (value:any, ctx:any) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartColors = [
      {
        backgroundColor : []
      },
    ];
    if(this.type == "Usuarios que más han prestado"){
      this.restUser.getUsers().subscribe((resp: any) => {
        this.users = resp.users
        let dataForGraphics: Array<number>= [];
        resp.users.forEach((user:any) => {
          if(user.count != 0){
            this.pieChartLabels.push(user.username);
            this.pieChartData.push(user.count);
          }
        });
        if(this.pieChartData.length != 0){
          for (let iterator = 0; iterator < this.pieChartData.length; iterator++) {
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          }
        }
      })
    }else if(this.type == "Libros más prestados"){
      this.restBook.getBooks().subscribe((resp: any) => {
        this.books = resp.books;
        let dataForGraphics: Array<number>= [];
        resp.books.forEach((book:any) => {
          if(book.count != 0){
            this.pieChartLabels.push(book.title);
            this.pieChartData.push(book.count);
          }
        });

        if(this.pieChartData.length != 0){
          for (let iterator = 0; iterator < this.pieChartData.length; iterator++) {
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          }
        }
      })
    }else{
      this.restReview.getReviews().subscribe((resp: any) => {
        this.reviews = resp.reviews;
        let dataForGraphics: Array<number>= [];
        resp.reviews.forEach((review:any) => {
          if(review.count != 0){
            this.pieChartLabels.push(review.title);
            this.pieChartData.push(review.count);
          }
        });

        if(this.pieChartData.length != 0){
          for (let iterator = 0; iterator < this.pieChartData.length; iterator++) {
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          }
        }
      })
    }
  }

}
