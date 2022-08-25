import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupProductKuDialogComponent } from './add-group-product-ku-dialog.component';

describe('AddGroupProductKuDialogComponent', () => {
  let component: AddGroupProductKuDialogComponent;
  let fixture: ComponentFixture<AddGroupProductKuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupProductKuDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupProductKuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
