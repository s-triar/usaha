import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { CashierDataService } from '../../cashier-data.service';
import { QueueKeyValidator } from './QueueKeyValidator';

@Component({
  templateUrl: './add-queue-popup.component.html',
  styleUrls: ['./add-queue-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddQueuePopupComponent implements OnInit {

  form = this.formBuilder.nonNullable.group({
    key: this.formBuilder.nonNullable.control('',{
      validators:[Validators.required],
      asyncValidators:[QueueKeyValidator.validate(this.cashierDataService)]})
  })


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddQueuePopupComponent>,
    private cashierDataService: CashierDataService
  ) { }

  ngOnInit(): void {
  }

  closeWithRandom(): void{
    this.dialogRef.close(true);
  }
  closeWithValue(): void{
    console.log('trigger', this.form.controls.key.value);
    this.dialogRef.close(this.form.controls.key.value);
  }
}
