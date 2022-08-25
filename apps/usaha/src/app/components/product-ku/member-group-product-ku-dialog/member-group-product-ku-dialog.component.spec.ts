import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberGroupProductKuDialogComponent } from './member-group-product-ku-dialog.component';

describe('MemberGroupProductKuDialogComponent', () => {
  let component: MemberGroupProductKuDialogComponent;
  let fixture: ComponentFixture<MemberGroupProductKuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberGroupProductKuDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberGroupProductKuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
