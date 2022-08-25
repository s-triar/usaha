import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductOfMyShopListItemDto, RegisterProductDto, RequestFindList, ResultFindList } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getMyStoreProducts(shop_id:string, data:RequestFindList):Observable<ResultFindList<ProductOfMyShopListItemDto>>{
    const params = new HttpParams({
      fromObject: {...data}
    });
    return this.http.get<ResultFindList<ProductOfMyShopListItemDto>>('/api/product/find-my-store-products/'+shop_id,{params:params});
  }

  addProduct(data: RegisterProductDto):Observable<void>{
    return this.http.post<void>('/api/product/register-product',data);
  }

  checkDuplicateBarcode(shop_id: string, barcode:string):Observable<boolean>{
    return this.http.get<boolean>('/api/product/check-duplicate-barcode/'+shop_id, {params:{barcode:barcode}});
  }
}
