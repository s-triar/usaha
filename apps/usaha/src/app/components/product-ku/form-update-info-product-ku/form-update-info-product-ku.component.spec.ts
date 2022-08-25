import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateInfoProductKuComponent } from './form-update-info-product-ku.component';

describe('FormUpdateInfoProductKuComponent', () => {
  let component: FormUpdateInfoProductKuComponent;
  let fixture: ComponentFixture<FormUpdateInfoProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUpdateInfoProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUpdateInfoProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
