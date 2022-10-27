import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
// import { MatTabsModule } from '@angular/material/tabs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of,  filter } from 'rxjs';
import { PRODUCT_DEFAULT } from '../../../constants';
import { CustomUploadFileEventChange } from '../../../types';
import { PopUpNotifService } from '../../pop-up/pop-up-notif/pop-up-notif.service';
// import { ScannerDialogComponent } from 'src/app/ui/components/pop-up/scanner-dialog/scanner-dialog.component';
import { CurrencyConversionService } from '../../../services/currency-conversion.service';
import { ProductTypeService } from '../../../services/product-type.service';
import { ProductService } from '../../../services/product.service';
import { DuplicateBarcodeValidator } from '../../../validators/DuplicateBarcodeValidator';
import { InputCurrencyComponent } from '../../form/input-currency/input-currency.component';
import { GroupProductKuDialogComponent, GroupProductKuDialogComponentData } from '../group-product-ku-dialog/group-product-ku-dialog.component';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ButtonUploadFileComponent } from '../../form/button-upload-file/button-upload-file.component';
import { MyShopProductGroupDto, ProductInfoUpdateDto, ProductTypeDto } from '@usaha/api-interfaces';
import { ScannerDialogComponent } from '../../pop-up/scanner-dialog/scanner-dialog.component';

@UntilDestroy()
@Component({
  selector: 'usaha-form-update-info-product-ku',
  templateUrl: './form-update-info-product-ku.component.html',
  styleUrls: ['./form-update-info-product-ku.component.scss'],
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
export class FormUpdateInfoProductKuComponent implements OnInit {
  @Input() idUsaha!: string;
  @Input() dataGoods!: ProductInfoUpdateDto;
  @Output() Submitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('selectGoodType', { static: true }) selectGoodType!: MatSelect;
  defaultImg: string = PRODUCT_DEFAULT;
  url: string | null | ArrayBuffer = null;
  urlImg: string | null | ArrayBuffer = null;
  GoodsTypesLama!: ProductTypeDto[] | null | undefined;
  GoodsTypes!: ProductTypeDto[];
  GoodsTypesData!: ProductTypeDto[];
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
  form: FormGroup = this.fb.nonNullable.group({
        id: this.fb.nonNullable.control(0,{validators:[Validators.required]}),
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
        new_product_group_ids: this.fb.control(this.fb.array([])),
        removed_product_group_ids: this.fb.control(this.fb.array([])),
  });
  
  get NameProduct(): AbstractControl|null{
    return this.form.get('name');
  }
  get DescriptionProduct(): AbstractControl|null{
    return this.form.get('description');
  }
  get BarcodeProduct(): AbstractControl|null{
    return this.form.get('barcode');
  }
  get ContainProduct(): AbstractControl|null{
    return this.form.get('contain');
  }
  // get AvailableOnlineProduct(): AbstractControl|null{
  //   return this.form.get('AvailableOnline');
  // }
  get PhotoProduct(): AbstractControl|null{
    return this.form.get('photo');
  }
  get PhotoFileProduct(): AbstractControl|null{
    return this.form.get('photo_file');
  }
  get PhotoStringProduct(): AbstractControl|null{
    return this.form.get('photo_string');
  }
  get GoodsTypeIdProduct(): AbstractControl|null{
    return this.form.get('product_type_id');
  }
  get ParentBarcodeProduct(): AbstractControl|null{
    return this.form.get('barcode_parent');
  }
  get GoodsGroupProduct(): FormArray{
    return this.form.get('product_group_ids') as FormArray;
  }
  get AddGoodsGroups(): FormArray{
    return this.form.get('new_product_group_ids') as FormArray;
  }
  get RemoveGoodsGroups(): FormArray{
    return this.form.get('removed_product_group_ids') as FormArray;
  }



  constructor(
    private fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
    private dialog: MatDialog,
    private notifService: PopUpNotifService
  ) {}

  ngOnInit(): void {
    
    this.initForm();
    this.productTypeService.getAllProductType().pipe(untilDestroyed(this)).subscribe(res => {
      if (res.length > 0){
        this.GoodsTypesData = res;
        this.GoodsTypes = this.GoodsTypesData.filter(x=>x.parent_id===0);
        const temp = this.GoodsTypesData.find(
          (x) => x.id === this.dataGoods.product_type_id
        );
        this.GoodsTypes = res.filter((y) =>
            temp?.parent_id
              ? y.parent_id === temp?.parent_id
              : y.parent_id === null
          );
          if (temp?.parent_id) {
            this.temporarySelectedGoodType = temp?.parent_id;
            this.GoodsTypes.push(this.goodTypeBack);
            this.GoodsTypes.push(this.goodTypeReset);
          }
      }
    });
    console.log(this.GoodsTypesData);
  }
  cancel(): void {
    this.Canceled.emit();
  }
  submit(): void {
    if (!this.form.valid) {
      this.notifService
        .show({
          title: 'Form Tidak Valid',
          message:
            'Harap isi form dengan benar. Pastikan tidak ada peringatan.',
          type: 'warning',
        })
        .afterClosed()
        .subscribe();
      return;
    }
    const temp = this.form.value;
    // temp.AddGoodsGroups = this.AddGoodsGroupProduct.value.value ?? [];
    // temp.RemoveGoodsGroups = this.RemoveGoodsGroups.value.value ?? [];
    console.log(temp);
    this.productService
      .update(temp)
      .pipe(
        untilDestroyed(this),
        switchMap((x) =>
          this.notifService
            .show({
              message: 'Info Produk berhasil diubah.',
              title: 'Sukses',
              type: 'success',
            })
            .afterClosed()
            .pipe(switchMap((y) => of(x)))
        )
      )
      .subscribe((x: string) => this.Submitted.emit());
  }
  initForm(): void {
    this.form = this.fb.nonNullable.group({
        id: this.fb.nonNullable.control(this.dataGoods.id,{validators:[Validators.required]}),
        shop_id: this.fb.nonNullable.control(this.idUsaha,{validators:[Validators.required]}),
        barcode:this.fb.nonNullable.control(this.dataGoods.barcode,{
          validators:[Validators.required, Validators.maxLength(255)],
          asyncValidators:[DuplicateBarcodeValidator.validate(this.productService, this.idUsaha)]
        }),
        name:this.fb.nonNullable.control(this.dataGoods.name, {validators:[Validators.required, Validators.maxLength(255)]}),
        product_type_id: this.fb.nonNullable.control(this.dataGoods.product_type_id,{validators:[Validators.required]}),
        product_group_ids: this.fb.control(this.fb.array([])),
        barcode_parent: this.fb.control(this.dataGoods.product_parent_barcode,{validators:[Validators.maxLength(255)]}),
        description: this.fb.control(this.dataGoods.description,{validators:[Validators.maxLength(255)]}),
        contain: this.fb.nonNullable.control(this.dataGoods.contain, {validators:[Validators.required, Validators.min(1)]}),
        photo_string:this.fb.control(null),
        photo_file:this.fb.control(null),
        photo:this.fb.control(null),
        new_product_group_ids: this.fb.control(this.fb.array([])),
        removed_product_group_ids: this.fb.control(this.fb.array([])),
  });

    this.tempSelectedGoodsGroup = this.dataGoods.groups.map((x) => {
      const r: MyShopProductGroupDto = { //MyGoodsGroupsListItemDto
        id: x.id,
        name: x.name,
        // members: x.members.map((y) => {
        //   const s: MyGoodsGroupsListMemberItemDto = {
        //     id: y.id,
        //     name: y.name,
        //     photoUrl: null,
        //   };
        //   return s;
        // }),
      };
      return r;
    });
  }
  resetForm(): void {
    this.initForm();
  }
  openScanner(): void {
    this.dialog
      .open(ScannerDialogComponent, {
        hasBackdrop: true,
        width: '480px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((x) => {
        this.BarcodeProduct?.setValue(null);
        if (x !== undefined) {
          this.BarcodeProduct?.setValue(x);
        }
        this.BarcodeProduct?.updateValueAndValidity();
      });
  }
  changed(event: CustomUploadFileEventChange): void {
    if (event.file !== null) {
      this.url = event.dataFile;
      this.form.patchValue({
        PhotoString: event.dataFile,
        PhotoFile: event.file,
        Photo: event.file?.name,
      });
      this.PhotoProduct?.updateValueAndValidity();
      this.PhotoFileProduct?.updateValueAndValidity();
      this.PhotoStringProduct?.updateValueAndValidity();
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
      this.form.get('product_type_id')?.setValue(this.temporarySelectedGoodType);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    }
    else if (v === this.goodTypeReset.id){
      const a = this.GoodsTypesData.filter(y => y.parent_id === 0);
      this.GoodsTypes = Array.from(a);
      this.temporarySelectedGoodType = null;
      this.form.get('product_type_id')?.setValue(this.temporarySelectedGoodType);
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
    this.form.get('product_type_id')?.updateValueAndValidity();
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
      if (this.form.get('product_group_ids')?.value.length > 0){
        this.form.get('product_group_ids')?.value.clear();
      }
      res.map(x => x.id).forEach(x => this.form.get('product_group_ids')?.value.push(this.fb.control(x)));
    });
  }
  removeGroup(id: string): void{
    const idx = this.tempSelectedGoodsGroup.findIndex(x => x.id === id);
    this.tempSelectedGoodsGroup.splice(idx, 1);
    // const idx2 = this.form.get('product_group_ids')?.controls.findIndex(x => x.value === id);
    this.form.get('product_group_ids')?.value.removeAt(idx);
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
