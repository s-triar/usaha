import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpNotifService } from './pop-up-notif.service';
export type NotifDialogType = {
  type: 'success'|'error'|'warning'|'info';
  title: string;
  message: string|null;
};
@Component({
  selector: 'app-pop-up-notif',
  templateUrl: './pop-up-notif.component.html',
  styleUrls: ['./pop-up-notif.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [

  ]
})
export class PopUpNotifComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PopUpNotifComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotifDialogType
  ) { }

  ngOnInit(): void {
  }
  closeWith(value: boolean): void{
    this.dialogRef.close(value);
  }
}
