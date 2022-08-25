import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of } from 'rxjs';
import { ProductStockService } from '../../../services/product-stock.service';
import { PopUpNotifService } from '../../pop-up/pop-up-notif/pop-up-notif.service';


@UntilDestroy()
@Component({
  selector: 'usaha-form-adjust-stock-product-ku',
  templateUrl: './form-adjust-stock-product-ku.component.html',
  styleUrls: ['./form-adjust-stock-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FormAdjustStockProductKuComponent implements OnInit {
  @Input() id!: string;

  @Output() Submitted: EventEmitter<void> = new EventEmitter<void>();
  @Output() Canceled: EventEmitter<void> = new EventEmitter<void>();
  form: FormGroup = this.fb.nonNullable.group({
    product_id: this.fb.nonNullable.control(this.id, {validators:[Validators.required]}),
    n: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
    description: this.fb.nonNullable.control('adjust stock')
  });
  get NProduct(): FormControl{
    return this.form.get('n') as FormControl;
  }
  get DescriptionProduct(): FormControl{
    return this.form.get('description') as FormControl;
  }
  constructor(
    private fb: FormBuilder,
    private notifService: PopUpNotifService,
    private readonly productStockService: ProductStockService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void{
    this.form = this.fb.nonNullable.group({
      product_id: this.fb.nonNullable.control(this.id, {validators:[Validators.required]}),
      n: this.fb.nonNullable.control(0,{validators:[Validators.required, Validators.min(0)]}),
      description: this.fb.nonNullable.control('')
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
    this.productStockService.addStock(temp.value)
        .pipe(
          untilDestroyed(this),
          switchMap(() =>
            this.notifService.show({message: 'Stok produk berhasil diubah.', title: 'Sukses', type: 'success'}).afterClosed()
                             .pipe(switchMap(() => of()))
          )
        )
        .subscribe(
          () => this.Submitted.emit()
        );
  }
}
