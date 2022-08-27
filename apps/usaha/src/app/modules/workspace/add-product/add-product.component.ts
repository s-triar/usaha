import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderSimpleComponent } from '../../../components/header/page-header-simple/page-header-simple.component';
import { FormAddProductKuComponent } from '../../../components/product-ku/form-add-product-ku/form-add-product-ku.component';
import { ActivatedRoute } from '@angular/router';
import { BackService } from '../../../directives/back/back.service';

@Component({
  selector: 'usaha-add-product',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderSimpleComponent,
    FormAddProductKuComponent
  ],
  providers:[BackService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  shop_id!:string;
  constructor(
    private _aRoute: ActivatedRoute,
    private _navback: BackService
  ) {}

  ngOnInit(): void {
    this.shop_id = this._aRoute.snapshot.data['shop_id'];
  }

  submitted():void{
    this._navback.back(null, true);
  }
  canceled():void{
    this._navback.back(null, true);
  }

}
