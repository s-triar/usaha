import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormUpdatePriceProductKuComponent } from '../form-update-price-product-ku/form-update-price-product-ku.component';

@Component({
  templateUrl: './update-price-product-ku-bottom-sheet.component.html',
  styleUrls: ['./update-price-product-ku-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    FormUpdatePriceProductKuComponent
  ]
})
export class UpdatePriceProductKuBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<UpdatePriceProductKuBottomSheetComponent>,
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
