import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogType, PopUpConfirmationComponent } from './pop-up-confirmation.component';

@Injectable(
  {
  providedIn: 'root'
}
)
export class PopUpConfirmationService {

  dialogRef!: MatDialogRef<PopUpConfirmationComponent> ;
  constructor(private dialog: MatDialog) { }

  show(data: ConfirmationDialogType): MatDialogRef<PopUpConfirmationComponent>{
    this.dialogRef = this.dialog.open(PopUpConfirmationComponent, {
      disableClose: true,
      data
    });
    return this.dialogRef;
  }
  close(): void{
    this.dialogRef.close();
  }
}
