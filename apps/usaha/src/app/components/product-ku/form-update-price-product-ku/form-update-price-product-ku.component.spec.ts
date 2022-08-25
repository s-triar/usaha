import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdatePriceProductKuComponent } from './form-update-price-product-ku.component';

describe('FormUpdatePriceProductKuComponent', () => {
  let component: FormUpdatePriceProductKuComponent;
  let fixture: ComponentFixture<FormUpdatePriceProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUpdatePriceProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUpdatePriceProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
