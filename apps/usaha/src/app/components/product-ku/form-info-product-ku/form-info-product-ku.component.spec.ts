import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInfoProductKuComponent } from './form-info-product-ku.component';

describe('FormInfoProductKuComponent', () => {
  let component: FormInfoProductKuComponent;
  let fixture: ComponentFixture<FormInfoProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormInfoProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInfoProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
