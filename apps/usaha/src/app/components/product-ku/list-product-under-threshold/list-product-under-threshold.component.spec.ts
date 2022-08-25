import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductUnderThresholdComponent } from './list-product-under-threshold.component';

describe('ListProductUnderThresholdComponent', () => {
  let component: ListProductUnderThresholdComponent;
  let fixture: ComponentFixture<ListProductUnderThresholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListProductUnderThresholdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProductUnderThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
