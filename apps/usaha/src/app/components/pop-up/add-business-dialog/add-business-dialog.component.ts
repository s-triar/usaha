import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DataAddBusiness } from 'src/app/application/types';



@Component({
  selector: 'app-add-business-dialog',
  templateUrl: './add-business-dialog.component.html',
  styleUrls: ['./add-business-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatButtonModule
  ]
})
export class AddBusinessDialogComponent implements OnInit {
  data!: DataAddBusiness[] ;

  constructor(public dialogRef: MatDialogRef<AddBusinessDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: DataAddBusiness[]) {
    this.data = data;
  }

  ngOnInit(): void {
  }

  go(link: string): void{
    this.dialogRef.close(link);
  }

}
