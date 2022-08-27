import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceStateService } from '../workspace-state.service';
import { SearchFormListComponent } from '../../../components/form/search-form-list/search-form-list.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { PageNumberChangedEvent, PageSizeChangedEvent, PaginationSimpleComponent } from '../../../components/pagination/pagination-simple/pagination-simple.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../services/product.service';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductOfMyShopListItemDto } from '@usaha/api-interfaces';

@Component({
  selector: 'usaha-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [
    CommonModule,
    SearchFormListComponent,
    ReactiveFormsModule,
    MatListModule,
    PaginationSimpleComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
})
export class ProductComponent implements OnInit {
  shop_id!:string;
  @ViewChild('pagination',{static:true}) pagination!:PaginationSimpleComponent;
  form:FormGroup = this._fb.nonNullable.group({
    name:this._fb.nonNullable.control(''),
    page:this._fb.nonNullable.control(1),
    pageSize:this._fb.nonNullable.control(20)
  });
  items: ProductOfMyShopListItemDto[]=[
    // {
    //   barcode:'acdaea',
    //   id:'Vg',
    //   name:'namae barang',
    //   price:12030,
    //   product_type_name:'Karet',
    //   shop_id:'Vg',
    //   stock:34,
    //   whole_sale_price:2344
    // }
  ];
  constructor(
    private _fb:FormBuilder,
    private _wsStateService: WorkspaceStateService,
    private _productService: ProductService,
    private _aRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.shop_id = this._aRouter.snapshot.parent?.params['shop_id'];
    this._wsStateService.title$.next('Produk');
    this.form.valueChanges.pipe(
      startWith({
        name:'',
        page:1,
        pageSize:20
      }),
      debounceTime(500),
      switchMap(x=>this._productService.getMyStoreProducts(this.shop_id,x))
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
