import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderSimpleComponent } from '../../../components/header/page-header-simple/page-header-simple.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ShopService } from '../../../services/shop.service';
import { ShopTypeService } from '../../../services/shop-type.service';
import { IndonesianAddressService } from '../../../services/indonesian-address.service';
import { AddMyStoreValidator } from './add-my-store.validator';
import { Observable, of, pipe, switchMap } from 'rxjs';
import { DistrictDto, ProvinceDto, RegencyDto, ShopTypeDto, VillageDto } from '@usaha/api-interfaces';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BackService } from '../../../directives/back/back.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'usaha-add-my-store',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderSimpleComponent,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatSnackBarModule
  ],
  templateUrl: './add-my-store.component.html',
  styleUrls: ['./add-my-store.component.css'],
  providers:[BackService]
})
export class AddMyStoreComponent implements OnInit {


  form: FormGroup = this._fb.nonNullable.group({
    shop_code: this._fb.nonNullable.control('',{validators:[Validators.required],asyncValidators:[AddMyStoreValidator.checkDuplicateShopCode(this._shopService)]}),
    name: this._fb.nonNullable.control('', {validators:[Validators.required]}),
    shop_type_id: this._fb.nonNullable.control(1,{validators:[Validators.required]}),
    email: this._fb.control('', {
      validators:[Validators.email]
    }),
    photo: this._fb.control(''),
    phone: this._fb.nonNullable.control('',{validators:[Validators.required, Validators.pattern('[0-9]+')]}),
    address: this._fb.nonNullable.group({
      province: this._fb.nonNullable.control({value:'', disabled:false},{validators:[Validators.required]}),
      city: this._fb.nonNullable.control({value:'', disabled:true},{validators:[Validators.required]}),
      district: this._fb.nonNullable.control({value:'', disabled:true},{validators:[Validators.required]}),
      village: this._fb.nonNullable.control({value:'', disabled:true},{validators:[Validators.required]}),
      street: this._fb.nonNullable.control({value:'', disabled:true},{validators:[Validators.required]}),
      postal_code: this._fb.nonNullable.control({value:'', disabled:true},{validators:[Validators.required,Validators.maxLength(5),Validators.minLength(5),Validators.pattern('[0-9]+')]}),
      geo_map_location:this._fb.control('')
    })
  });

  shopTypes$!:Observable<ShopTypeDto[]>;

  get provinceControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['province'] as FormControl;
  }
  get cityControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['city'] as FormControl;
  }
  get districtControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['district'] as FormControl;
  }
  get villageControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['village'] as FormControl;
  }
  get streetControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['street'] as FormControl;
  }
  get postalCodeControl():FormControl{
    return (this.form.controls['address'] as FormGroup).controls['postal_code'] as FormControl;
  }

  provinces$!:Observable<ProvinceDto[]>;
  cities$!:Observable<RegencyDto[]>;
  districts$!:Observable<DistrictDto[]>;
  villages$!:Observable<VillageDto[]>;


  isFormBusy=false;
  constructor(
    private _shopService:ShopService,
    private _shopTypeService: ShopTypeService,
    private _wilayah:IndonesianAddressService,
    private _fb:FormBuilder,
    private _backService:BackService,
    private _snackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getShopTypes();
    this.getAllProvices();
  }

  getShopTypes():void{
    this.shopTypes$ = this._shopTypeService.getAllShopType();
  }

  getAllProvices():void{
    this.provinces$ = this._wilayah.getAllProvince();
  }
  getAllRegencyUnderProvince(province_id:string):void{
    this.cities$ = this._wilayah.getAllRegencyInProvince(province_id);
  }
  getAllDistrictUnderRegency(regency_id:string):void{
    this.districts$ = this._wilayah.getAllDistrictInRegency(regency_id);
  }
  getAllVillageUnderDistrict(district_id:string):void{
    this.villages$ = this._wilayah.getAllVillageInDistrict(district_id);
  }
  changeProvince(event: MatSelectChange):void{
    this.provinceControl.setValue(event.value.name);
    this.getAllRegencyUnderProvince(event.value.id);
    this.resetRegency(false);
    this.resetDistrict(true);
    this.resetVillage(true);
    this.resetStreet(true);
    this.resetPostalCode(true);
  }
  
  changeRegency(event:MatSelectChange):void{
    this.cityControl.setValue(event.value.name);
    this.getAllDistrictUnderRegency(event.value.id);
    this.resetDistrict(false);
    this.resetVillage(true);
    this.resetStreet(true);
    this.resetPostalCode(true);
  }
  changeDistrict(event:MatSelectChange):void{
    this.districtControl.setValue(event.value.name);
    this.getAllVillageUnderDistrict(event.value.id);
    this.resetVillage(false);
    this.resetStreet(true);
    this.resetPostalCode(true);
  }
  changeVillage(event:MatSelectChange):void{
    this.villageControl.setValue(event.value.name);
    this.resetStreet(false);
    this.resetPostalCode(false);

  }
  resetRegency(disabled:boolean):void{
    this.cityControl.reset();
    if(disabled){
      this.cities$ = of([]);
      this.cityControl.disable();
    }
    else{
      this.cityControl.enable();
    }
  }
  resetDistrict(disabled:boolean):void{
    this.districtControl.reset();
    if(disabled){
      this.districts$ = of([]);
      this.districtControl.disable();
    }
    else{
      this.districtControl.enable();
    }
  }
  resetVillage(disabled:boolean):void{
    this.villageControl.reset();
    if(disabled){
      this.villages$ = of([]);
      this.villageControl.disable();
    }
    else{
      this.villageControl.enable();
    }
  }
  resetStreet(disabled:boolean):void{
    this.streetControl.reset();
    if(disabled){
      this.streetControl.disable();
    }
    else{
      this.streetControl.enable();
    }
  }
  resetPostalCode(disabled:boolean):void{
    this.postalCodeControl.reset();
    if(disabled){
      this.postalCodeControl.disable();
    }
    else{
      this.postalCodeControl.enable();
    }
  }
  resetForm():void{
    this.form.reset();
    this.resetRegency(true);
    this.resetDistrict(true);
    this.resetVillage(true);
    this.resetStreet(true);
    this.resetPostalCode(true);
  }
  submit():void{
    if(this.form.valid){
      this.isFormBusy=true;
      this._shopService.registerShop(this.form.value)
      .pipe(
        switchMap(()=>this._snackBar.open('Tambah toko berhasil','Tutup',{duration:1000}).afterDismissed())
      )
      .subscribe({
        next: ()=>this._backService.back(null,true),
        error: () =>this.isFormBusy=false
      });
    }
  }
}
