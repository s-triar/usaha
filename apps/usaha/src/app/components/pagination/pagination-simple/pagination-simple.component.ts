import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export type currentPageDescription = {
  isCurrentPageStartPage: boolean;
  isCurrentPageLastPage: boolean;
};
export type PageNumberChangedEvent = {
  pageNumber: number
};
export type PageSizeChangedEvent = {
  pageSize: number
};


@Component({
  selector: 'usaha-pagination-simple',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './pagination-simple.component.html',
  styleUrls: ['./pagination-simple.component.css'],
})
export class PaginationSimpleComponent implements OnInit {
  @Input() pageSize = 20;
  @Input() pageNumber = 1;
  @Output() pageSelectedChanged: EventEmitter<PageNumberChangedEvent> = new EventEmitter<PageNumberChangedEvent>();
  @Output() nPageChanged: EventEmitter<PageSizeChangedEvent> = new EventEmitter<PageSizeChangedEvent>();
  
  currentPage: currentPageDescription = {
    isCurrentPageStartPage: true,
    isCurrentPageLastPage: true
  };
  formSearch = this.fb.group({
    PageSize: this.fb.nonNullable.control(this.pageSize),
    PageNumber: this.fb.nonNullable.control(this.pageNumber)
  });
  pages: number[] = [1];
  constructor(private fb: FormBuilder) {}

  
  ngOnInit(): void {
    this.formSearch.controls.PageNumber.valueChanges
        .subscribe(x => {
          this.pageSelectedChanged.emit({pageNumber: x});
        });
    this.formSearch.controls.PageSize.valueChanges
        .subscribe(x => {
          this.nPageChanged.emit({pageSize: x});
        });
  }
  setPagesNumbers(ns: number): void{
    const temp: number[] = [];
    for (let i = 0; i < ns; i++){
      temp.push(i + 1);
    }
    this.pages = temp;
    this.checkCurrentPagePos();
  }
  setPageSize(n: number): void{
    this.formSearch.controls.PageSize.setValue(n);
  }

  private switchCurrentPageDescription(s: boolean, l: boolean): void{
    this.currentPage.isCurrentPageStartPage = s;
    this.currentPage.isCurrentPageLastPage = l;
  }
  checkCurrentPagePos(): void{
    const index = this.getCurrentPageIndex();
    if (index === 0 && index === (this.pages.length - 1)){
      this.switchCurrentPageDescription(true, true);
    }
    else if (index === 0){
      this.switchCurrentPageDescription(true, false);
    }
    else if (index === (this.pages.length - 1)){
      this.switchCurrentPageDescription(false, true);
    }else{
      this.switchCurrentPageDescription(false, false);
    }
  }
  getCurrentPageIndex(): number{
    // const currentPage = parseInt(this.formSearch.controls.PageNumber.value, 10);
    const currentPage = this.formSearch.controls.PageNumber.value;
    const currentPageIndex = this.pages.findIndex(x => x === currentPage);
    return currentPageIndex;
  }
  setPageValue(v: number): void{
    this.formSearch.controls.PageNumber.setValue(v, {
      onlySelf: true
    });
    this.formSearch.controls.PageNumber.updateValueAndValidity();
    this.checkCurrentPagePos();

  }
  nextPage(): void{
    if (!this.currentPage.isCurrentPageLastPage){
      const v = this.pages[this.getCurrentPageIndex() + 1];
      this.setPageValue(v);
    }
  }

  fastNextPage(): void{
    const v = this.pages[this.pages.length - 1];
    this.setPageValue(v);
  }
  previousPage(): void{
    if (!this.currentPage.isCurrentPageStartPage){
      const v = this.pages[this.getCurrentPageIndex() - 1];
      this.setPageValue(v);
    }
  }
  fastPreviousPage(): void{
    const v = this.pages[0];
    this.setPageValue(v);
  }
  selectPage(event: MatSelectChange): void{
    this.setPageValue(parseInt(event.value, 10));
  }
}
