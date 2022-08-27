import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MemberProductGroupDto, ResultFindList } from '@usaha/api-interfaces';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { currentPageDescription, PageNumberChangedEvent, PageSizeChangedEvent, PaginationSimpleComponent } from '../../pagination/pagination-simple/pagination-simple.component';


@Component({
  templateUrl: './member-group-product-ku-dialog.component.html',
  styleUrls: ['./member-group-product-ku-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    PaginationSimpleComponent
  ]
})
export class MemberGroupProductKuDialogComponent implements OnInit {
  @ViewChild(PaginationSimpleComponent, {static: true}) pagination!: PaginationSimpleComponent;
  displayedColumns: string[] = ['barcode','name'];
  form: FormGroup = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(''),
    pageSize: this.fb.nonNullable.control(6),
    page: this.fb.nonNullable.control(1)
  });
  memberList: MemberProductGroupDto[] = [];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberGroupProductKuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product_group_id: string,
    private dialog: MatDialog,
    private _productService: ProductService
  ) { }

  ngOnInit(): void {
    this.searchGroupProduct();
    this.form.controls['name'].setValue('', {onlySelf: true});
    this.form.controls['name'].updateValueAndValidity();
  }
  searchGroupProduct(): void{
    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(x => this.searchMemberForShow())
    )
    .subscribe(x => {
      this.memberList = x.items;
    });
  }
  searchMemberForShow(): Observable<ResultFindList<MemberProductGroupDto>>{
    return this._productService.findMemberProductGroup(this.product_group_id,this.form.value)
  }
  pageSelectedChange(event: PageNumberChangedEvent):void{
    this.form.patchValue({
      page:event.pageNumber
    });

  }
  nPageChange(event: PageSizeChangedEvent):void{
     this.form.patchValue({
      pageSize:event.pageSize
    });
  }
}
