import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifDialogType, PopUpNotifComponent } from './pop-up-notif.component';

@Injectable({
  providedIn: 'root',
})
export class PopUpNotifService {

  dialogRef!: MatDialogRef<PopUpNotifComponent> ;
  constructor(private dialog: MatDialog) { }

  show(data: NotifDialogType): MatDialogRef<PopUpNotifComponent>{
    this.dialogRef = this.dialog.open(PopUpNotifComponent, {
      disableClose: true,
      data
    });
    return this.dialogRef;
  }
  close(): void{
    this.dialogRef.close();
  }
}
