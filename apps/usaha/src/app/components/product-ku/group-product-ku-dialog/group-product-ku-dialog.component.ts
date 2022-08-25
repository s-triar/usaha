import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MyShopProductGroupDto, ResultFindList } from '@usaha/api-interfaces';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { ProductGroupService } from '../../../services/product-group.service';

import { currentPageDescription, PageNumberChangedEvent, PageSizeChangedEvent, PaginationSimpleComponent } from '../../pagination/pagination-simple/pagination-simple.component';
import { AddGroupProductKuDialogComponent } from '../add-group-product-ku-dialog/add-group-product-ku-dialog.component';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';

type MyShopProductGroupChoiceDto= MyShopProductGroupDto&{
  selected: boolean;
};
type GroupProductKuDialogComponentData = {
  groupSelected: MyShopProductGroupDto[],
  id_usaha:string
}
@Component({
  templateUrl: './group-product-ku-dialog.component.html',
  styleUrls: ['./group-product-ku-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PaginationSimpleComponent,
    FlexLayoutModule
  ]
})
export class GroupProductKuDialogComponent implements OnInit {

  @ViewChild(PaginationSimpleComponent, {static: true}) pagination!: PaginationSimpleComponent;
  // @Input() groupSelected: MyGoodsGroupsListItemDto[] = [];

  displayedColumns: string[] = [ 'name', 'id'];
  form: FormGroup = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(''),
    pageSize: this.fb.nonNullable.control(6),
    page: this.fb.nonNullable.control(1)
  });
  // form2: FormGroup = this.fb.group({
  //   name: [''],
  //   pageSize: [6],
  //   page: [1]
  // });
  groupList: MyShopProductGroupChoiceDto[] = [];
  pages: number[] = [1];
  currentPage: currentPageDescription = {
    isCurrentPageStartPage: true,
    isCurrentPageLastPage: true
  };
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GroupProductKuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: GroupProductKuDialogComponentData,
    private dialog: MatDialog,
    private readonly productGroupService: ProductGroupService
  ) { }

  ngOnInit(): void {
    this.searchGroupProduct();
    this.setPaginationConfig();
    this.form.get('name')?.setValue('', {onlySelf: true});
    this.form.get('name')?.updateValueAndValidity();
  }
  searchGroupProduct(): void{
    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(x => this.callSearchProductApi())
    )
    .subscribe(x => {
      this.mappingDtoToVar(x);
      this.pagination.setPagesNumbers(x.count);
    });
  }
  mappingDtoToVar(x: ResultFindList<MyShopProductGroupDto>): void{
    this.groupList = x.items.map(y => {
      const temp: MyShopProductGroupChoiceDto = {
        ...y,
        selected: this.dialogData.groupSelected.find(z => y.id === z.id) ? true : false
      };
      return temp;
    });
    this.pages = [];
    for (let i = 0; i < x.count; i++){
      this.pages.push(i + 1);
    }
  }
  callSearchProductApi(): Observable<ResultFindList<MyShopProductGroupDto>>{
    return this.productGroupService.findMyShopProductGroups(
      this.form.get('name')?.value,
      this.dialogData.id_usaha,
      this.form.get('page')?.value,
      this.form.get('pageSize')?.value,
    );
  }
  setPaginationConfig(): void{
    this.pagination.setPageSize(this.form.get('pageSize')?.value);
    this.pagination.setPagesNumbers(this.form.get('page')?.value);
  }
  paginationNChanged(event: PageSizeChangedEvent): void{
    this.form.get('pageSize')?.setValue(event.pageSize);
    this.form.updateValueAndValidity();
  }

  pageSelectedChanged(event: PageNumberChangedEvent): void{
    this.form.get('page')?.setValue(event.pageNumber);
    this.form.updateValueAndValidity();
  }
  selectGroup(id: string): void{
    const temp = this.groupList.find(x => x.id === id);
    if (temp){
      this.dialogData.groupSelected.push({id: temp.id, name: temp.name,
        //  members: temp.members
        });
    }
    this.reRenderGroupList();
  }
  reRenderGroupList(): void{
    this.groupList = this.groupList.map(y => {
      const temp: MyShopProductGroupChoiceDto = {
        ...y,
        selected: this.dialogData.groupSelected.find(z => y.id === z.id) ? true : false
      };
      return temp;
    });
  }
  unselectGroup(id: string): void{
    const index = this.dialogData.groupSelected.findIndex(x => x.id === id);
    this.dialogData.groupSelected.splice(index, 1);
    this.reRenderGroupList();
  }
  showMemberDialog(id: string): void{
    const temp = this.groupList.find(x => x.id === id);
    this.dialog.open(MemberGroupProductKuDialogComponent,
      {
        data: [],
        // data: temp && temp.members.length > 0 ? temp.members : [],
        maxWidth: '480px',
        width: '80%',
        disableClose: true
      })
      .afterClosed().subscribe();
  }
  openDialogAddGroup(): void{
    this.dialog.open(AddGroupProductKuDialogComponent,
      {data: [], hasBackdrop: true, maxWidth: '480px', width: '80%', disableClose: true })
    .afterClosed()
    .pipe(switchMap(x => this.callSearchProductApi()))
    .subscribe(x => {
      this.mappingDtoToVar(x);
      this.pagination.setPagesNumbers(x.count);
    });
  }
  close(): void{
    this.dialogRef.close(this.dialogData.groupSelected);
  }
}
