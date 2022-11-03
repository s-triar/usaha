import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueuePopupComponent } from './add-queue-popup.component';

describe('AddQueuePopupComponent', () => {
  let component: AddQueuePopupComponent;
  let fixture: ComponentFixture<AddQueuePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQueuePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQueuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
