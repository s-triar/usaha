import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderSimpleComponent } from '../../../components/header/page-header-simple/page-header-simple.component';
import { FormInfoProductKuComponent } from '../../../components/product-ku/form-info-product-ku/form-info-product-ku.component';
import { ActivatedRoute } from '@angular/router';
import { BackService } from '../../../directives/back/back.service';
import { ProductService } from '../../../services/product.service';
import { ProductInfoDto } from '@usaha/api-interfaces';
import { tap } from 'rxjs';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { UpdatePriceProductKuBottomSheetComponent } from '../../../components/product-ku/update-price-product-ku-bottom-sheet/update-price-product-ku-bottom-sheet.component';
import { AddStockProductKuBottomSheetComponent } from '../../../components/product-ku/add-stock-product-ku-bottom-sheet/add-stock-product-ku-bottom-sheet.component';
import { AdjustStockPrroductKuBottomSheetComponent } from '../../../components/product-ku/adjust-stock-prroduct-ku-bottom-sheet/adjust-stock-prroduct-ku-bottom-sheet.component';

@Component({
  selector: 'usaha-info-product',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderSimpleComponent,
    FormInfoProductKuComponent,
    MatBottomSheetModule,
    UpdatePriceProductKuBottomSheetComponent,
    AddStockProductKuBottomSheetComponent,
    AdjustStockPrroductKuBottomSheetComponent,

  ],
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.scss'],
})
export class InfoProductComponent implements OnInit {
  shop_id!:string;
  product_id!:string;
  product!: ProductInfoDto;
  constructor(
    private _aRoute: ActivatedRoute,
    private _navback: BackService,
    private _productService: ProductService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    console.log(this._aRoute.snapshot.params);
    
    this.shop_id = this._aRoute.snapshot.params['shop_id'];
    this.product_id = this._aRoute.snapshot.params['product_id'];
    console.log(this.shop_id, this.product_id);
    this.product = this._aRoute.snapshot.data['product']
  }
  update():void{
    // this.router.navigate([ this.URL_UPDATE_PATTERN, this.dataGoods.id], {
    //   relativeTo: this.routes.parent,
    // });
  }
  updatePrice(): void {
    this.bottomSheet.open(UpdatePriceProductKuBottomSheetComponent,
      {
        data: this.product.id
      }).afterDismissed()
        .subscribe(() => {
          this.renewInfo();
      });
  }
  addStock(): void {
    this.bottomSheet.open(AddStockProductKuBottomSheetComponent,
      {
        data: this.product.id
      }).afterDismissed()
        .subscribe(() => {
          this.renewInfo();
      });
  }
  adjustStock(): void {
    this.bottomSheet.open(AdjustStockPrroductKuBottomSheetComponent,
      {
        data: this.product.id
      }).afterDismissed()
        .subscribe(() => {
          this.renewInfo();
      });
  }
  renewInfo(): void{
    this._productService.getInfoProduct(this.shop_id, this.product_id)
        .subscribe(x => this.product = x);
  }
}
