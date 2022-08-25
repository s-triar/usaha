import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpNotifComponent } from './pop-up-notif.component';

describe('PopUpNotifComponent', () => {
  let component: PopUpNotifComponent;
  let fixture: ComponentFixture<PopUpNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpNotifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
