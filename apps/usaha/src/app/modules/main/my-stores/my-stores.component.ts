import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNumberChangedEvent, PageSizeChangedEvent, PaginationSimpleComponent } from '../../../components/pagination/pagination-simple/pagination-simple.component';
import { SearchFormListComponent } from '../../../components/form/search-form-list/search-form-list.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { MyShopListItemDto } from '@usaha/api-interfaces';
import { MatCardModule } from "@angular/material/card";
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { PRODUCT_DEFAULT } from '../../../constants';
import { environment } from 'apps/usaha/src/environments/environment';
@Component({
  selector: 'usaha-my-stores',
  standalone: true,
  imports: [
    CommonModule,
    PaginationSimpleComponent,
    SearchFormListComponent,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    LayoutModule
  ],
  templateUrl: './my-stores.component.html',
  styleUrls: ['./my-stores.component.css'],
})
export class MyStoresComponent implements OnInit {
  @ViewChild('pagination',{static:true}) pagination!:PaginationSimpleComponent;
  screen = '';
  backend=environment.backend;
  defaultPhoto = PRODUCT_DEFAULT;
  form:FormGroup = this._fb.nonNullable.group({
    name:this._fb.nonNullable.control(''),
    page:this._fb.nonNullable.control(1),
    pageSize:this._fb.nonNullable.control(6)
  });
  items: MyShopListItemDto[]=[];
  constructor(
    private _fb:FormBuilder,
    private _shopService:ShopService,
    private _breakPointObs: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this._breakPointObs.observe([
      Breakpoints.Handset,
      Breakpoints.Web,
      Breakpoints.Tablet,
    ]).subscribe(result => {
      if (result.breakpoints['(min-width: 840px) and (orientation: portrait)'] || result.breakpoints['(min-width: 1280px) and (orientation: landscape)']) {
        this.screen="web";
      }
      else if(result.breakpoints['(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)'] || result.breakpoints['(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)']){
        this.screen="tablet";
      }
      else if(result.breakpoints['(max-width: 599.98px) and (orientation: portrait)'] || result.breakpoints['(max-width: 959.98px) and (orientation: landscape)']){
        this.screen="handset";
      }
    });
    this.form.valueChanges.pipe(
      startWith({
        name:'',
        page:1,
        pageSize:6
      }),
      debounceTime(500),
      switchMap(x=>this._shopService.findMyShops(x))
    )
    .subscribe(x=>{
      const pageTotal = Math.ceil(x.count/this.form.controls['pageSize'].value);
      this.pagination.setPagesNumbers(pageTotal);
      this.items = x.items;
    });
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
  searchValue(event:string):void{
    this.form.patchValue({
      name:event
    });
  }
}
