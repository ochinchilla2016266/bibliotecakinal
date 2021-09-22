import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksReviewsComponent } from './books-reviews.component';

describe('BooksReviewsComponent', () => {
  let component: BooksReviewsComponent;
  let fixture: ComponentFixture<BooksReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksReviewsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
