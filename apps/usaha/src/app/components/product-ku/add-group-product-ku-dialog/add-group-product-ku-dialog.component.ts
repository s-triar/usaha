import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormAddGroupProductKuComponent } from '../form-add-group-product-ku/form-add-group-product-ku.component';

@Component({
  templateUrl: './add-group-product-ku-dialog.component.html',
  styleUrls: ['./add-group-product-ku-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    FormAddGroupProductKuComponent
  ]
})
export class AddGroupProductKuDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddGroupProductKuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string[],
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  submited(): void{
    this.dialogRef.close();
  }
  canceled(): void{
    this.dialogRef.close();
  }

}
