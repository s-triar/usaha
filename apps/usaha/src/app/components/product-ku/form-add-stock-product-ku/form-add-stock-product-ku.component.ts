import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { ProductInService } from '../../../services/product-in.service';
// import { GoodsService } from 'src/app/infrastructure/backend/goods.service';
import { InputCurrencyComponent } from '../../form/input-currency/input-currency.component';
import { PopUpNotifService } from '../../pop-up/pop-up-notif/pop-up-notif.service';

@UntilDestroy()
@Component({
  selector: 'usaha-form-add-stock-product-ku',
  templateUrl: './form-add-stock-product-ku.component.html',
  styleUrls: ['./form-add-stock-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    InputCurrencyComponent
  ]
})

export class FormAddStockProductKuComponent implements OnInit {
  @Input() id!: string;

  @Output() Submitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();

  form: FormGroup = this.fb.nonNullable.group({
    product_id: this.fb.nonNullable.control(this.id, {validators:[Validators.required, Validators.maxLength(255)]}),
    n: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(1)]}),
    price: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(1)]}),
    from: this.fb.control('', {validators:[Validators.maxLength(255)]})
  });

  get N(): FormControl{
    return this.form.get('n') as FormControl;
  }
  get Price(): FormControl{
    return this.form.get('price') as FormControl;
  }
  get From(): FormControl{
    return this.form.get('from') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private notifService: PopUpNotifService,
    private readonly productInService: ProductInService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void{
    this.form = this.fb.nonNullable.group({
      product_id: this.fb.nonNullable.control(this.id, {validators:[Validators.required, Validators.maxLength(255)]}),
      n: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(1)]}),
      price: this.fb.nonNullable.control(0, {validators:[Validators.required, Validators.min(1)]}),
      from: this.fb.control('', {validators:[Validators.maxLength(255)]})
    });
  }
  cancel(): void{
    this.Canceled.emit();
  }
  submit(): void{
    if (!this.form.valid){
      this.notifService.show({title: 'Form Tidak Valid', message: 'Harap isi form dengan benar. Pastikan tidak ada peringatan.', type: 'warning'})
      .afterClosed().subscribe();
      return;
    }
    const temp = this.form.value;
    this.productInService.addStock(temp)
        .pipe(
          untilDestroyed(this),
          switchMap(() =>
            this.notifService.show({message: 'Stok produk berhasil ditambah.', title: 'Sukses', type: 'success'}).afterClosed()
          )
        )
        .subscribe(
          () => this.Submitted.emit()
        );
  }
}
