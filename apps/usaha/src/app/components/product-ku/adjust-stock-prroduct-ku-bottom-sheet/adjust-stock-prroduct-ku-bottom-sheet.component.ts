import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormAdjustStockProductKuComponent } from '../form-adjust-stock-product-ku/form-adjust-stock-product-ku.component';

@Component({
  templateUrl: './adjust-stock-prroduct-ku-bottom-sheet.component.html',
  styleUrls: ['./adjust-stock-prroduct-ku-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    FormAdjustStockProductKuComponent,
    MatBottomSheetModule
  ]
})
export class AdjustStockPrroductKuBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AdjustStockPrroductKuBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public id: string
  ) { }

  ngOnInit(): void {
  }
  submitted(): void{
    this.bottomSheetRef.dismiss();
  }
  canceled(): void{
    this.bottomSheetRef.dismiss();
  }
}
