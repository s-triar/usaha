import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInfoProductComponent } from './update-info-product.component';

describe('UpdateInfoProductComponent', () => {
  let component: UpdateInfoProductComponent;
  let fixture: ComponentFixture<UpdateInfoProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInfoProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInfoProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
