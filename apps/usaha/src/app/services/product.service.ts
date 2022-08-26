import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductOfMyShopListItemDto, RegisterProductDto, RequestFindList, ResultFindList } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';
import { FormConversionService } from './form-conversion.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private convertFormData: FormConversionService
  ) { }

  getMyStoreProducts(shop_id:string, data:RequestFindList):Observable<ResultFindList<ProductOfMyShopListItemDto>>{
    const params = new HttpParams({
      fromObject: {...data}
    });
    return this.http.get<ResultFindList<ProductOfMyShopListItemDto>>('/api/product/find-my-store-products/'+shop_id,{params:params});
  }

  addProduct(data: RegisterProductDto):Observable<void>{
    const formData = this.convertFormData.convertModelToFormData(data, null, null);
    return this.http.post<void>('/api/product/register-product',formData);
  }

  checkDuplicateBarcode(shop_id: string, barcode:string):Observable<boolean>{
    return this.http.get<boolean>('/api/product/check-duplicate-barcode/'+shop_id, {params:{barcode:barcode}});
  }
}
