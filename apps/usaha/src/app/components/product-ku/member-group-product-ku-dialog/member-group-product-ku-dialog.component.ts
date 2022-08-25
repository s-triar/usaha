import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { currentPageDescription } from 'src/app/application/types';
import { MyGoodsGroupsListMemberItemDto } from 'src/app/domain/backend/Dtos';
import { PaginationComponent } from 'src/app/ui/components/pagination/pagination/pagination.component';

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
    FlexLayoutModule
  ]
})
export class MemberGroupProductKuDialogComponent implements OnInit {
  @ViewChild(PaginationComponent, {static: true}) pagination!: PaginationComponent;
  displayedColumns: string[] = ['name'];
  form: FormGroup = this.fb.group({
    Search: [''],
  });
  memberList: MyGoodsGroupsListMemberItemDto[] = [];
  pages: number[] = [1];
  currentPage: currentPageDescription = {
    isCurrentPageStartPage: true,
    isCurrentPageLastPage: true
  };
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberGroupProductKuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public members: MyGoodsGroupsListMemberItemDto[],
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.searchGroupProduct();
    this.form.controls.Search.setValue('', {onlySelf: true});
    this.form.controls.Search.updateValueAndValidity();
  }
  searchGroupProduct(): void{
    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(x => this.searchMemberForShow())
    )
    .subscribe(x => {
      this.memberList = x;
    });
  }
  searchMemberForShow(): Observable<MyGoodsGroupsListMemberItemDto[]>{
    return of(this.members.filter(x =>
        x.id.includes(this.form.controls.Search.value) ||
        x.name.includes(this.form.controls.Search.value)
      ));
  }
}
