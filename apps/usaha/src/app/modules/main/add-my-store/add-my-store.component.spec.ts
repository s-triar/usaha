import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMyStoreComponent } from './add-my-store.component';

describe('AddMyStoreComponent', () => {
  let component: AddMyStoreComponent;
  let fixture: ComponentFixture<AddMyStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMyStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
