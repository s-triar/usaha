import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { GroupProductKuDialogComponent, GroupProductKuDialogComponentData } from '../group-product-ku-dialog/group-product-ku-dialog.component';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';
import { switchMap } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputCurrencyComponent } from '../../form/input-currency/input-currency.component';
import { PopUpNotifService } from '../../pop-up/pop-up-notif/pop-up-notif.service';
import { ButtonUploadFileComponent } from '../../form/button-upload-file/button-upload-file.component';
import { DuplicateBarcodeValidator } from '../../../validators/DuplicateBarcodeValidator';
import { ScannerDialogComponent } from '../../pop-up/scanner-dialog/scanner-dialog.component';
import { PRODUCT_DEFAULT } from '../../../constants';
import { CustomUploadFileEventChange } from '../../../types';
import { MyShopProductGroupDto, ProductTypeDto } from '@usaha/api-interfaces';
import { ProductService } from '../../../services/product.service';
import { ProductTypeService } from '../../../services/product-type.service';
import { CurrencyConversionService } from '../../../services/currency-conversion.service';

@UntilDestroy()
@Component({
  selector: 'usaha-form-add-product-ku',
  templateUrl: './form-add-product-ku.component.html',
  styleUrls: ['./form-add-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    ButtonUploadFileComponent,
    FormsModule,
    InputCurrencyComponent,
    MatCheckboxModule
  ],
  providers:[CurrencyConversionService, CurrencyPipe]

})
export class FormAddProductKuComponent implements OnInit {

  @Input() idUsaha!: string;
  @Output() Submitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('selectGoodType', {static: true}) selectGoodType!: MatSelect;
  defaultImg: string = PRODUCT_DEFAULT;
  url: string|null|ArrayBuffer = null;
  urlImg: string|null|ArrayBuffer = null;
  GoodsTypes!: ProductTypeDto[];
  GoodsTypesData!: ProductTypeDto[]; // all data
  goodTypeReset: ProductTypeDto = {
    id: -1,
    name: 'Reset',
    parent_id:0,
  };
  goodTypeBack: ProductTypeDto = {
    id: -2,
    name: 'Kembali ke sebelumnya',
    parent_id:0,
  };
  temporarySelectedGoodType!: number | null | undefined;
  tempSelectedGoodsGroup: MyShopProductGroupDto[] = [];
  form: FormGroup = this.fb.nonNullable.group(
    {
      infoGroup: this.fb.nonNullable.group({
        shop_id: this.fb.nonNullable.control(this.idUsaha,{validators:[Validators.required]}),
        barcode:this.fb.nonNullable.control('',{
          validators:[Validators.required, Validators.maxLength(255)],
          asyncValidators:[DuplicateBarcodeValidator.validate(this.productService, this.idUsaha)]
        }),
        name:this.fb.nonNullable.control('', {validators:[Validators.required, Validators.maxLength(255)]}),
        product_type_id: this.fb.nonNullable.control(0,{validators:[Validators.required]}),
        product_group_ids: this.fb.control(this.fb.array([])),
        barcode_parent: this.fb.control(null,{validators:[Validators.maxLength(255)]}),
        description: this.fb.control('',{validators:[Validators.maxLength(255)]}),
        contain: this.fb.nonNullable.control(1, {validators:[Validators.required, Validators.min(1)]}),
        photo_string:this.fb.control(null),
        photo_file:this.fb.control(null),
        photo:this.fb.control(null),
      }),
      pricingGroup:this.fb.nonNullable.group({
        buy_price: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
        sell_price: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
        whole_sale_price:this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
        is_auto_use_whole_sale_price: this.fb.nonNullable.control(false),
        min_auto_whole_sale_price:this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
      }),
      stockGroup: this.fb.nonNullable.group({
        current_stock: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
        threshold_stock: this.fb.nonNullable.control(0, {validators:[Validators.required,Validators.min(0)]}),
      })
    }
  );
  get infoGroup(): FormGroup{
    return this.form.get('infoGroup') as FormGroup;
  }
  get NameProduct(): AbstractControl|null{
    return this.infoGroup.get('name');
  }
  get DescriptionProduct(): AbstractControl|null{
    return this.infoGroup.get('description');
  }
  get BarcodeProduct(): AbstractControl|null{
    return this.infoGroup.get('barcode');
  }
  get ContainProduct(): AbstractControl|null{
    return this.infoGroup.get('contain');
  }
  // get AvailableOnlineProduct(): AbstractControl|null{
  //   return this.infoGroup.get('AvailableOnline');
  // }
  get PhotoProduct(): AbstractControl|null{
    return this.infoGroup.get('photo');
  }
  get PhotoFileProduct(): AbstractControl|null{
    return this.infoGroup.get('photo_file');
  }
  get PhotoStringProduct(): AbstractControl|null{
    return this.infoGroup.get('photo_string');
  }
  get GoodsTypeIdProduct(): AbstractControl|null{
    return this.infoGroup.get('product_type_id');
  }
  get ParentBarcodeProduct(): AbstractControl|null{
    return this.infoGroup.get('barcode_parent');
  }
  get GoodsGroupProduct(): FormArray{
    return this.infoGroup.get('product_group_ids') as FormArray;
  }
  // ==================================================
  get pricingGroup(): FormGroup{
    return this.form.get('pricingGroup') as FormGroup;
  }
  get BuyPriceProduct(): AbstractControl|null{
    return this.pricingGroup.get('buy_price');
  }
  get PriceProduct(): AbstractControl|null{
    return this.pricingGroup.get('sell_price');
  }
  get WholesalerPriceProduct(): AbstractControl|null{
    return this.pricingGroup.get('whole_sale_price');
  }
  get WholesalerMinProduct(): AbstractControl|null{
    return this.pricingGroup.get('min_auto_whole_sale_price');
  }
  get IsWholesalerPriceAutoProduct(): AbstractControl|null{
    return this.pricingGroup.get('is_auto_use_whole_sale_price');
  }
  // ===================================================
  get stockGroup(): FormGroup{
    return this.form.get('stockGroup') as FormGroup;
  }
  get NProduct(): AbstractControl|null{
    return this.stockGroup.get('current_stock');
  }
  get ThresholdProduct(): AbstractControl|null{
    return this.stockGroup.get('threshold_stock');
  }
  constructor(
    private fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
    private dialog: MatDialog,
    private notifService: PopUpNotifService
    ) { }

  ngOnInit(): void {
    this.productTypeService.getAllProductType().pipe(untilDestroyed(this)).subscribe(res => {
      if (res.length > 0){
        this.GoodsTypesData = res;
        this.GoodsTypes = this.GoodsTypesData.filter(x=>x.parent_id===0);
      }
    });
    this.initForm();
  }
  submit(): void{
    if (!this.form.valid){
      this.notifService.show({title: 'Form Tidak Valid', message: 'Harap isi form dengan benar. Pastikan tidak ada peringatan.', type: 'warning'})
      .afterClosed().subscribe();
      return;
    }
    const temp = this.form.value;
    console.log(temp);
    
    temp.infoGroup.product_group_ids = this.infoGroup.get('product_group_ids')?.value.value ?? [];
    const temp2 = {...temp.infoGroup, ...temp.pricingGroup, ...temp.stockGroup};
    console.log(temp2);
    
    this.productService.addProduct(temp2)
        .pipe(
          untilDestroyed(this),
          switchMap(() =>
            this.notifService.show({message: 'Produk berhasil ditambah.', title: 'Sukses', type: 'success'}).afterClosed()
          )
        )
        .subscribe(
          () => this.Submitted.emit()
        );
  }
  initForm(): void{
    this.form =  this.fb.nonNullable.group(
      {
        infoGroup: this.fb.nonNullable.group({
          shop_id: this.fb.nonNullable.control(this.idUsaha,{validators:[Validators.required]}),
          barcode:this.fb.nonNullable.control('',{
            validators:[Validators.required, Validators.maxLength(255)],
            asyncValidators:[DuplicateBarcodeValidator.validate(this.productService, this.idUsaha)]
          }),
          name:this.fb.nonNullable.control('', {validators:[Validators.required, Validators.maxLength(255)]}),
          product_type_id: this.fb.nonNullable.control(0,{validators:[Validators.required]}),
          product_group_ids: this.fb.control(this.fb.array([])),
          barcode_parent: this.fb.control(null,{validators:[Validators.maxLength(255)]}),
          description: this.fb.control('',{validators:[Validators.maxLength(255)]}),
          contain: this.fb.nonNullable.control(1, {validators:[Validators.required, Validators.min(1)]}),
          photo_string:this.fb.control(null),
          photo_file:this.fb.control(null),
          photo:this.fb.control(null),
        }),
        pricingGroup:this.fb.nonNullable.group({
          buy_price: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
          sell_price: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
          whole_sale_price:this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
          is_auto_use_whole_sale_price: this.fb.nonNullable.control(false),
          min_auto_whole_sale_price:this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(0)]}),
        }),
        stockGroup: this.fb.nonNullable.group({
          current_stock: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
          threshold_stock: this.fb.nonNullable.control(0, {validators:[Validators.required,Validators.min(0)]}),
        })
      }
    );
  }
  resetForm(): void{
    this.initForm();
  }
  openScanner(): void{
    this.dialog.open(ScannerDialogComponent, {hasBackdrop: true, width: '480px', disableClose: true}).afterClosed().subscribe(x => {
      this.infoGroup.get('barcode')?.setValue(null);
      if (x !== undefined){
        this.infoGroup.get('barcode')?.setValue(x);
      }
      this.infoGroup.get('barcode')?.updateValueAndValidity();
    });
  }
  changed(event: CustomUploadFileEventChange): void{
    console.log(event);
    
    if (event.file !== null){
      this.url = event.dataFile;
      this.infoGroup.patchValue({
        photo_string: event.dataFile,
        photo_file: event.file,
        photo: event.file?.name
      });
      this.infoGroup.get('photo')?.updateValueAndValidity();
      this.infoGroup.get('photo_file')?.updateValueAndValidity();
      this.infoGroup.get('photo_string')?.updateValueAndValidity();
      console.log(this.form.value);
      
    }
  }
  selectGoodsType(event: MatSelectChange): void{
    const val  = event.value as string;
    const v = parseInt(val, 10);
    const temp = this.GoodsTypesData.find(x => x.id === v);
    const temp_children = this.GoodsTypesData.filter(x => x.parent_id === temp?.id);
    console.log(temp_children);
    
    // let tempArr: GoodsTypeDto[] = [];
    if (v === this.goodTypeBack.id){
      const t = this.GoodsTypesData.find(x => x.id === this.temporarySelectedGoodType);
      if (t?.parent_id === 0){ // dipuncak
        const a = this.GoodsTypesData.filter(y => y.parent_id === 0);
        this.GoodsTypes = Array.from(a);
        this.temporarySelectedGoodType = null;
      }else{
        const t2 = this.GoodsTypesData.find(x => x.id === t?.parent_id);
        const t2_children = this.GoodsTypesData.filter(x => x.parent_id === t2?.id);

        this.temporarySelectedGoodType = t2?.id;
        if (t2_children !== null && t2_children !== undefined && t2_children.length > 0){
          const temp2 = this.GoodsTypesData.find(x => x.id === this.temporarySelectedGoodType);
          const temp2_children = this.GoodsTypesData.filter(x => x.parent_id === temp2?.id);
          const a = t2_children;
          this.GoodsTypes = Array.from(a);
          if (temp2_children !== null && temp2_children !== undefined){
            this.GoodsTypes.unshift(temp2!);
          }
          this.GoodsTypes.push(this.goodTypeBack);
          this.GoodsTypes.push(this.goodTypeReset);
        }
      }
      this.infoGroup.get('product_type_id')?.setValue(this.temporarySelectedGoodType);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    }
    else if (v === this.goodTypeReset.id){
      const a = this.GoodsTypesData.filter(y => y.parent_id === 0);
      this.GoodsTypes = Array.from(a);
      this.temporarySelectedGoodType = null;
      this.infoGroup.get('product_type_id')?.setValue(this.temporarySelectedGoodType);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    }
    else if (temp_children !== null && temp_children !== undefined && temp_children.length > 0){
      this.temporarySelectedGoodType = v;
      const a = temp_children;
      this.GoodsTypes = Array.from(a);
      this.GoodsTypes.unshift(temp!);
      this.GoodsTypes.push(this.goodTypeBack);
      this.GoodsTypes.push(this.goodTypeReset);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    }
    this.infoGroup.get('product_type_id')?.updateValueAndValidity();
  }
  openDialogGroup(): void{
    const data_dialog:GroupProductKuDialogComponentData={
      groupSelected: this.tempSelectedGoodsGroup,
      id_usaha:this.idUsaha
    }
    this.dialog.open(GroupProductKuDialogComponent,
      {data: data_dialog, hasBackdrop: true, maxWidth: '480px', width: '80%', disableClose: true })
    .afterClosed().subscribe((res: MyShopProductGroupDto[]) => {
      res = res.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.tempSelectedGoodsGroup = res;
      if (this.infoGroup.get('product_group_ids')?.value.length > 0){
        this.infoGroup.get('product_group_ids')?.value.clear();
      }
      res.map(x => x.id).forEach(x => this.infoGroup.get('product_group_ids')?.value.push(this.fb.control(x)));
    });
  }
  removeGroup(id: string): void{
    const idx = this.tempSelectedGoodsGroup.findIndex(x => x.id === id);
    this.tempSelectedGoodsGroup.splice(idx, 1);
    // const idx2 = this.form.get('product_group_ids')?.controls.findIndex(x => x.value === id);
    this.infoGroup.get('product_group_ids')?.value.removeAt(idx);
  }
  showGroupMemberDialog(id: string): void{
    const temp = this.tempSelectedGoodsGroup.find(x => x.id === id);
    this.dialog.open(MemberGroupProductKuDialogComponent,
      {
        // data: temp && temp.members.length > 0 ? temp.members : [],
        data: id,
        maxWidth: '480px',
        width: '80%',
        disableClose: true
      })
      .afterClosed().subscribe();
  }

}
