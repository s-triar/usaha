import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddStockProductKuComponent } from './form-add-stock-product-ku.component';

describe('FormAddStockProductKuComponent', () => {
  let component: FormAddStockProductKuComponent;
  let fixture: ComponentFixture<FormAddStockProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddStockProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddStockProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
