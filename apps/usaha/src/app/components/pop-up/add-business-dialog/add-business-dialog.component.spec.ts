import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessDialogComponent } from './add-business-dialog.component';

describe('AddBusinessDialogComponent', () => {
  let component: AddBusinessDialogComponent;
  let fixture: ComponentFixture<AddBusinessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
