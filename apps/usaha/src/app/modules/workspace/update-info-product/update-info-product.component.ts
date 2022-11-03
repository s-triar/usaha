import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ProductInfoUpdateDto } from '@usaha/api-interfaces';
import { filter, switchMap, of } from 'rxjs';
import { PopUpNotifService } from '../../../components/pop-up/pop-up-notif/pop-up-notif.service';
import { ScannerDialogComponent } from '../../../components/pop-up/scanner-dialog/scanner-dialog.component';
import { GroupProductKuDialogComponent } from '../../../components/product-ku/group-product-ku-dialog/group-product-ku-dialog.component';
import { MemberGroupProductKuDialogComponent } from '../../../components/product-ku/member-group-product-ku-dialog/member-group-product-ku-dialog.component';
import { PRODUCT_DEFAULT } from '../../../constants';
import { CustomUploadFileEventChange } from '../../../types';
import { ActivatedRoute } from '@angular/router';
import { BackService } from '../../../directives/back/back.service';
import { FormUpdateInfoProductKuComponent } from '../../../components/product-ku/form-update-info-product-ku/form-update-info-product-ku.component';
import { PageHeaderSimpleComponent } from '../../../components/header/page-header-simple/page-header-simple.component';

@Component({
  selector: 'usaha-update-info-product',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderSimpleComponent,
    FormUpdateInfoProductKuComponent
  ],
  templateUrl: './update-info-product.component.html',
  styleUrls: ['./update-info-product.component.scss'],
  providers:[BackService],

})
export class UpdateInfoProductComponent implements OnInit {
  idUsaha!: string;
  dataGoods!: ProductInfoUpdateDto;


  

  constructor(
    private _aRoute: ActivatedRoute,
    private _navback: BackService
  ) {}

  ngOnInit(): void {
    console.log(this._aRoute.snapshot.params);

    this.idUsaha = this._aRoute.snapshot.params['shop_id'];
    this.dataGoods= this._aRoute.snapshot.data['product'];
    console.log(this.idUsaha);
    
  }

  submitted():void{
    this._navback.back(null, true);
  }
  canceled():void{
    this._navback.back(null, true);
  }
  
}
