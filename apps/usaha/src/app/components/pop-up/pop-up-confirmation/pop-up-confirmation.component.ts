import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpConfirmationService } from './pop-up-confirmation.service';

export type ConfirmationDialogType = {
  title: string;
  message: string|null;
  buttonTheme: 'primary'|'accent'|'warn';
};

@Component({
  selector: 'app-pop-up-confirmation',
  templateUrl: './pop-up-confirmation.component.html',
  styleUrls: ['./pop-up-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  // providers: [
  //   PopUpConfirmationService
  // ]
})
export class PopUpConfirmationComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PopUpConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogType
    ) {

  }

  ngOnInit(): void {
  }

  closeWith(value: boolean): void{
    this.dialogRef.close(value);
  }
}
