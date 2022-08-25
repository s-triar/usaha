import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdjustStockProductKuComponent } from './form-adjust-stock-product-ku.component';

describe('FormAdjustStockProductKuComponent', () => {
  let component: FormAdjustStockProductKuComponent;
  let fixture: ComponentFixture<FormAdjustStockProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAdjustStockProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdjustStockProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
