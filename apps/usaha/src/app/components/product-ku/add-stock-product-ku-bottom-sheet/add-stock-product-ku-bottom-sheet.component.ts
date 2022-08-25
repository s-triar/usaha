import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
// import { MatDialogModule } from '@angular/material/dialog';
import { FormAddStockProductKuComponent } from '../form-add-stock-product-ku/form-add-stock-product-ku.component';

@Component({
  templateUrl: './add-stock-product-ku-bottom-sheet.component.html',
  styleUrls: ['./add-stock-product-ku-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    MatBottomSheetModule,
    FormAddStockProductKuComponent
  ]
})
export class AddStockProductKuBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddStockProductKuBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public id: string
  ) { }
  ngOnInit(): void {
    console.log(this.id);
  }
  submitted(): void{
    this.bottomSheetRef.dismiss();
  }
  canceled(): void{
    this.bottomSheetRef.dismiss();
  }
}
