import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockProductKuBottomSheetComponent } from './add-stock-product-ku-bottom-sheet.component';

describe('AddStockProductKuBottomSheetComponent', () => {
  let component: AddStockProductKuBottomSheetComponent;
  let fixture: ComponentFixture<AddStockProductKuBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockProductKuBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockProductKuBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
