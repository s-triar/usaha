import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProductKuDialogComponent } from './group-product-ku-dialog.component';

describe('GroupProductKuDialogComponent', () => {
  let component: GroupProductKuDialogComponent;
  let fixture: ComponentFixture<GroupProductKuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupProductKuDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProductKuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
