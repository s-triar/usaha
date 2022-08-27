import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { switchMap } from 'rxjs';
import { ProductGroupService } from '../../../services/product-group.service';
import { ShopStateService } from '../../../services/shop-state.service';
// import { GoodsGroupService } from 'src/app/infrastructure/backend/goods-group.service';
import { PopUpNotifService } from '../../pop-up/pop-up-notif/pop-up-notif.service';
import { DuplicateGroupNameValidator } from './DuplicateGroupNameValidator';

@Component({
  selector: 'usaha-form-add-group-product-ku',
  templateUrl: './form-add-group-product-ku.component.html',
  styleUrls: ['./form-add-group-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule
  ],
  providers:[ShopStateService]
})
export class FormAddGroupProductKuComponent implements OnInit {
  @Input() id_usaha!:string;
  @Output() Submitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();
  form: FormGroup = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('',{
      validators:[Validators.required, Validators.maxLength(255)],
      asyncValidators:[DuplicateGroupNameValidator.validate(this.productGroupService, this._shopStateService)]
    }),
    description: this.fb.control('',{
      validators:[Validators.maxLength(255)],
    }),
    shop_id: this.fb.nonNullable.control(this.id_usaha, {
      validators:[Validators.maxLength(255)],
    })
  });
  get NameGroup(): AbstractControl|null{
    return this.form.get('name') as AbstractControl;
  }
  get DescriptionGroup(): AbstractControl|null{
    return this.form.get('description') as AbstractControl;
  }
  constructor(
    private fb: FormBuilder,
    private readonly productGroupService: ProductGroupService,
    private readonly notifService: PopUpNotifService,
    private readonly _shopStateService:ShopStateService
    ) { 
    }

  ngOnInit(): void {
    
    this._shopStateService.current_shop$.next(this.id_usaha);
    this.form.controls['shop_id'].setValue(this.id_usaha);
    this.form.controls['shop_id'].updateValueAndValidity();
  }

  submit(): void{
    if (this.form.valid){
      this.productGroupService.createProductGroup(this.form.value)
          .pipe(
            switchMap(() =>
                this.notifService.show({message: 'Grup produk berhasil ditambah.', title: 'Sukses', type: 'success'}).afterClosed()
              )
            )
          .subscribe(
            () => this.Submitted.emit()
          );
    }
  }
  cancel(): void{
    this.Canceled.emit();
  }
}
