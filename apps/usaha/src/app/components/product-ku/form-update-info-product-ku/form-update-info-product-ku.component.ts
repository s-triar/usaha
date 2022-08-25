import { CommonModule } from '@angular/common';
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of, throwIfEmpty, filter } from 'rxjs';
import { PRODUCT_DEFAULT } from 'src/app/application/constant';
import { CustomUploadFileEventChange } from 'src/app/application/types';
import { InfoOfGoodsForUpdatingDto, GoodsTypeDto, MyGoodsGroupsListItemDto, MyGoodsGroupsListMemberItemDto } from 'src/app/domain/backend/Dtos';
import { GoodsTypeService } from 'src/app/infrastructure/backend/goods-type.service';
import { GoodsService } from 'src/app/infrastructure/backend/goods.service';
import { ButtonUploadFileComponent } from 'src/app/ui/components/form/button-upload-file/button-upload-file.component';
import { PopUpNotifService } from 'src/app/ui/components/pop-up/pop-up-notif/pop-up-notif.service';
import { ScannerDialogComponent } from 'src/app/ui/components/pop-up/scanner-dialog/scanner-dialog.component';
import { GroupProductKuDialogComponent } from '../group-product-ku-dialog/group-product-ku-dialog.component';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-form-update-info-product-ku',
  templateUrl: './form-update-info-product-ku.component.html',
  styleUrls: ['./form-update-info-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    ButtonUploadFileComponent,
  ]
})
export class FormUpdateInfoProductKuComponent implements OnInit {
  @Input() idUsaha!: string;
  @Input() dataGoods!: InfoOfGoodsForUpdatingDto;
  @Output() Submitted: EventEmitter<string> = new EventEmitter<string>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('selectGoodType', { static: true }) selectGoodType!: MatSelect;
  defaultImg: string = PRODUCT_DEFAULT;
  url: string | null | ArrayBuffer = null;
  urlImg: string | null | ArrayBuffer = null;
  GoodsTypes$Lama!: GoodsTypeDto[] | null | undefined;
  GoodsTypes$!: GoodsTypeDto[];
  GoodsTypesData!: GoodsTypeDto[];
  goodTypeReset: GoodsTypeDto = {
    id: -1,
    name: 'Reset',
    parentGoodsTypeId: null,
    subGoodsTypes: null,
  };
  goodTypeBack: GoodsTypeDto = {
    id: -2,
    name: 'Kembali ke sebelumnya',
    parentGoodsTypeId: null,
    subGoodsTypes: null,
  };
  temporarySelectedGoodType!: number | null | undefined;
  tempSelectedGoodsGroup: MyGoodsGroupsListItemDto[] = [];
  form: FormGroup = this.fb.group({
    Id: [null, [Validators.required]],
    // Barcode: [
    //   null,
    //   [Validators.required, Validators.maxLength(255)],
    //   [ DuplicateBarcodeValidator.validate(this.goodsService)]
    // ],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    Description: [null],
    Photo: [null],
    PhotoFile: [null],
    PhotoString: [null],
    GoodsTypeId: [null, [Validators.required]],
    Contain: [1, [Validators.required, Validators.min(1)]],
    AvailableOnline: [false],
    ParentBarcode: [null, [Validators.maxLength(255)]],
    // GoodsGroups: [this.fb.array([])],
    AddGoodsGroups: [this.fb.array([])],
    RemoveGoodsGroups: [this.fb.array([])]
  });
  get NameProduct(): AbstractControl | null {
    return this.form.get('Name');
  }
  get DescriptionProduct(): AbstractControl | null {
    return this.form.get('Description');
  }
  get BarcodeProduct(): AbstractControl | null {
    return this.form.get('Barcode');
  }
  get ContainProduct(): AbstractControl | null {
    return this.form.get('Contain');
  }
  get AvailableOnlineProduct(): AbstractControl | null {
    return this.form.get('AvailableOnline');
  }
  get PhotoProduct(): AbstractControl | null {
    return this.form.get('Photo');
  }
  get PhotoFileProduct(): AbstractControl | null {
    return this.form.get('PhotoFile');
  }
  get PhotoStringProduct(): AbstractControl | null {
    return this.form.get('PhotoString');
  }
  get GoodsTypeIdProduct(): AbstractControl | null {
    return this.form.get('GoodsTypeId');
  }
  get ParentBarcodeProduct(): AbstractControl | null {
    return this.form.get('ParentBarcode');
  }
  get AddGoodsGroupProduct(): FormArray {
    return this.form.controls.AddGoodsGroups as FormArray;
  }
  get RemoveGoodsGroups(): FormArray {
    return this.form.controls.RemoveGoodsGroups as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private readonly goodsService: GoodsService,
    private readonly goodsTypeService: GoodsTypeService,
    private dialog: MatDialog,
    private notifService: PopUpNotifService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.goodsTypeService.GoodsTypes$.pipe(
      untilDestroyed(this),
      filter(res => res.length > 0)
    ).subscribe(
      (res) => {
        if (res.length > 0) {
          this.GoodsTypesData = res;
          const temp = this.GoodsTypesData.find(
            (x) => x.id === this.dataGoods.goodsTypeId
          );
          this.GoodsTypes$ = res.filter((y) =>
            temp?.parentGoodsTypeId
              ? y.parentGoodsTypeId === temp?.parentGoodsTypeId
              : y.parentGoodsTypeId === null
          );
          if (temp?.parentGoodsTypeId) {
            this.temporarySelectedGoodType = temp?.parentGoodsTypeId;
            this.GoodsTypes$.push(this.goodTypeBack);
            this.GoodsTypes$.push(this.goodTypeReset);
          }
        }
      }
    );
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
    temp.AddGoodsGroups = this.AddGoodsGroupProduct.value.value ?? [];
    temp.RemoveGoodsGroups = this.RemoveGoodsGroups.value.value ?? [];
    console.log(temp);
    this.goodsService
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
      .subscribe((x: string) => this.Submitted.emit(x));
  }
  initForm(): void {
    this.form = this.fb.group({
      Id: [this.dataGoods.id, [Validators.required]],
      Name: [
        this.dataGoods.name,
        [Validators.required, Validators.maxLength(255)],
      ],
      Description: [this.dataGoods.description],
      Photo: [null],
      PhotoFile: [null],
      PhotoString: [null],
      GoodsTypeId: [this.dataGoods.goodsTypeId, [Validators.required]],
      Contain: [
        this.dataGoods.contain,
        [Validators.required, Validators.min(1)],
      ],
      AvailableOnline: [this.dataGoods.availableOnline],
      ParentBarcode: [
        this.dataGoods.parent?.barcode,
        [Validators.maxLength(255)],
      ],
      AddGoodsGroups: [this.fb.array([])],
      RemoveGoodsGroups: [this.fb.array([])]
    });

    this.tempSelectedGoodsGroup = this.dataGoods.groups.map((x) => {
      const r: MyGoodsGroupsListItemDto = {
        id: x.id,
        name: x.name,
        members: x.members.map((y) => {
          const s: MyGoodsGroupsListMemberItemDto = {
            id: y.id,
            name: y.name,
            photoUrl: null,
          };
          return s;
        }),
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
  selectGoodsType(event: MatSelectChange): void {
    const val = event.value as string;
    const v = parseInt(val, 10);
    this.changeGoodsType(v);
  }
  changeGoodsType(v: number): void {
    const temp = this.GoodsTypesData.find((x) => x.id === v);
    // let tempArr: GoodsTypeDto[] = [];
    if (v === this.goodTypeBack.id) {
      const t = this.GoodsTypesData.find(
        (x) => x.id === this.temporarySelectedGoodType
      );
      if (t?.parentGoodsTypeId === null) {
        // dipuncak
        const a = this.GoodsTypesData.filter(
          (y) => y.parentGoodsTypeId === null
        );
        this.GoodsTypes$ = Array.from(a);
        this.temporarySelectedGoodType = null;
      } else {
        const t2 = this.GoodsTypesData.find(
          (x) => x.id === t?.parentGoodsTypeId
        );
        this.temporarySelectedGoodType = t2?.id;
        if (
          t2?.subGoodsTypes !== null &&
          t2?.subGoodsTypes !== undefined &&
          t2.subGoodsTypes.length > 0
        ) {
          const temp2 = this.GoodsTypesData.find(
            (x) => x.id === this.temporarySelectedGoodType
          );
          const a = t2?.subGoodsTypes;
          this.GoodsTypes$ = Array.from(a);
          if (
            temp2?.subGoodsTypes !== null &&
            temp2?.subGoodsTypes !== undefined
          ) {
            this.GoodsTypes$.unshift(temp2);
          }
          this.GoodsTypes$.push(this.goodTypeBack);
          this.GoodsTypes$.push(this.goodTypeReset);
        }
      }
      this.GoodsTypeIdProduct?.setValue(this.temporarySelectedGoodType);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    } else if (v === this.goodTypeReset.id) {
      const a = this.GoodsTypesData.filter((y) => y.parentGoodsTypeId === null);
      this.GoodsTypes$ = Array.from(a);
      this.temporarySelectedGoodType = null;
      this.GoodsTypeIdProduct?.setValue(this.temporarySelectedGoodType);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    } else if (
      temp?.subGoodsTypes !== null &&
      temp?.subGoodsTypes !== undefined &&
      temp.subGoodsTypes.length > 0
    ) {
      this.temporarySelectedGoodType = v;
      const a = temp?.subGoodsTypes;
      this.GoodsTypes$ = Array.from(a);
      this.GoodsTypes$.unshift(temp);
      this.GoodsTypes$.push(this.goodTypeBack);
      this.GoodsTypes$.push(this.goodTypeReset);
      setTimeout(() => {
        this.selectGoodType.open();
      }, 100);
    }
    this.GoodsTypeIdProduct?.updateValueAndValidity();
  }
  openDialogGroup(): void {
    this.dialog
      .open(GroupProductKuDialogComponent, {
        data: this.tempSelectedGoodsGroup,
        hasBackdrop: true,
        maxWidth: '480px',
        width: '80%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: MyGoodsGroupsListItemDto[]) => {
        res = res.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        this.tempSelectedGoodsGroup = res;
        if (this.AddGoodsGroupProduct.value.length > 0) {
          this.AddGoodsGroupProduct.value.clear();
        }
        if (this.RemoveGoodsGroups.value.length > 0) {
          this.RemoveGoodsGroups.value.clear();
        }
        res
          .map((x) => x.id)
          .forEach((id) => {
            const idx = this.dataGoods.groups.findIndex((x) => x.id === id);
            if (idx === -1){
              this.AddGoodsGroupProduct.value.push(this.fb.control(id));
            }
          });
        this.dataGoods.groups
          .map((x) => x.id)
          .forEach(id => {
            const idx = res.findIndex((x) => x.id === id);
            if (idx === -1){
              this.RemoveGoodsGroups.value.push(this.fb.control(id));
            }
          });
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
      });
  }
  removeGroup(id: string): void {
    const idx = this.dataGoods.groups.findIndex((x) => x.id === id);
    if (idx === -1){
      this.tempSelectedGoodsGroup.splice(idx, 1);
    }
    else{
      this.tempSelectedGoodsGroup.splice(idx, 1);
      this.RemoveGoodsGroups.value.push(this.fb.control(id));
    }
    // const idx2 = this.GoodsGroupProduct.controls.findIndex(x => x.value === id);
    // this.GoodsGroupProduct.value.removeAt(idx);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
  showGroupMemberDialog(id: string): void {
    const temp = this.tempSelectedGoodsGroup.find((x) => x.id === id);
    this.dialog
      .open(MemberGroupProductKuDialogComponent, {
        data: temp && temp.members.length > 0 ? temp.members : [],
        maxWidth: '480px',
        width: '80%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((x) => {

      });
  }
}
