import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddProductKuComponent } from './form-add-product-ku.component';

describe('FormAddProductKuComponent', () => {
  let component: FormAddProductKuComponent;
  let fixture: ComponentFixture<FormAddProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
