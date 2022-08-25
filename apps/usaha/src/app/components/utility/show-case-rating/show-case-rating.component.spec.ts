import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCaseRatingComponent } from './show-case-rating.component';

describe('ShowCaseRatingComponent', () => {
  let component: ShowCaseRatingComponent;
  let fixture: ComponentFixture<ShowCaseRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCaseRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCaseRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
