import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePriceProductKuBottomSheetComponent } from './update-price-product-ku-bottom-sheet.component';

describe('UpdatePriceProductKuBottomSheetComponent', () => {
  let component: UpdatePriceProductKuBottomSheetComponent;
  let fixture: ComponentFixture<UpdatePriceProductKuBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePriceProductKuBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePriceProductKuBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
