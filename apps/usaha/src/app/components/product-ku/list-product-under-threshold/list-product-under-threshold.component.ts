import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNumberChangedEvent, PageSizeChangedEvent, PaginationComponent } from 'src/app/ui/components/pagination/pagination/pagination.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import {debounceTime,distinctUntilChanged, Observable, startWith, switchMap} from 'rxjs';
import { MyGoodsGroupsListContainerDto, MyGoodsGroupsListItemDto } from 'src/app/domain/backend/Dtos';
import { GoodsService } from 'src/app/infrastructure/backend/goods.service';
import { GoodsGroupService } from 'src/app/infrastructure/backend/goods-group.service';
import { FlexLayoutModule } from '@angular/flex-layout';
type MyGoodsGroupsListItemChoiceDto= MyGoodsGroupsListItemDto&{
  selected: boolean;
};
@Component({
  selector: 'app-list-product-under-threshold',
  standalone: true,
  templateUrl: './list-product-under-threshold.component.html',
  styleUrls: ['./list-product-under-threshold.component.scss'],
  imports: [
    CommonModule,
    PaginationComponent,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    FlexLayoutModule
  ],
})
export class ListProductUnderThresholdComponent implements OnInit {
  @ViewChild(PaginationComponent, {static: true}) pagination!: PaginationComponent;
  form: FormGroup = this.fb.group({
    Search: [''],
    PageSize: [6],
    PageNumber: [1]
  });
  pages: number[] = [1];
  groupList: MyGoodsGroupsListItemChoiceDto[] = [];

  constructor(private fb: FormBuilder, private goodsService: GoodsService, private goodsGroupService: GoodsGroupService) { 
    
  }

  ngOnInit(): void {
    this.searchGroupProduct();
    this.setPaginationConfig();
    this.form.controls.Search.setValue('', {onlySelf: true});
    this.form.controls.Search.updateValueAndValidity();
  }
  searchGroupProduct(): void{
    this.form.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(x => this.callSearchProductApi())
    )
    .subscribe(x => {
      this.mappingDtoToVar(x);
      this.pagination.setPagesNumbers(x.totalPages);
    });
  }
  mappingDtoToVar(x: MyGoodsGroupsListContainerDto): void{
    this.groupList = x.items.map(y => {
      const temp: MyGoodsGroupsListItemChoiceDto = {
        ...y,
        selected: false
      };
      return temp;
    });
    this.pages = [];
    for (let i = 0; i < x.totalPages; i++){
      this.pages.push(i + 1);
    }
  }
  callSearchProductApi(): Observable<MyGoodsGroupsListContainerDto>{
    return this.goodsGroupService.getMyGoodsGroup({
      Search: this.form.controls.Search.value,
      PageNumber: this.form.controls.PageNumber.value,
      PageSize: this.form.controls.PageSize.value
    });
  }
  setPaginationConfig(): void{
    this.pagination.setPageSize(this.form.controls.PageSize.value);
    this.pagination.setPagesNumbers(this.form.controls.PageNumber.value);
  }
  paginationNChanged(event: PageSizeChangedEvent): void{
    this.form.controls.PageSize.setValue(event.pageSize);
    this.form.updateValueAndValidity();
  }

  pageSelectedChanged(event: PageNumberChangedEvent): void{
    this.form.controls.PageNumber.setValue(event.pageNumber);
    this.form.updateValueAndValidity();
  }
}
