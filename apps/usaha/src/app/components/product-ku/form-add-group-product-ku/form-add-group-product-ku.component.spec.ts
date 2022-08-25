import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddGroupProductKuComponent } from './form-add-group-product-ku.component';

describe('FormAddGroupProductKuComponent', () => {
  let component: FormAddGroupProductKuComponent;
  let fixture: ComponentFixture<FormAddGroupProductKuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddGroupProductKuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddGroupProductKuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
