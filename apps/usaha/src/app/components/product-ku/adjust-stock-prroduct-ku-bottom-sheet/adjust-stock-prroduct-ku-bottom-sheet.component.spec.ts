import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustStockPrroductKuBottomSheetComponent } from './adjust-stock-prroduct-ku-bottom-sheet.component';

describe('AdjustStockPrroductKuBottomSheetComponent', () => {
  let component: AdjustStockPrroductKuBottomSheetComponent;
  let fixture: ComponentFixture<AdjustStockPrroductKuBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustStockPrroductKuBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustStockPrroductKuBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
