import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberProductGroupDto, ProductInfoDto, ProductOfMyShopListItemDto, RegisterProductDto, RequestFindList, ResultFindList, UpdateProductInfoDto } from '@usaha/api-interfaces';
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
    return this.http.get<ResultFindList<ProductOfMyShopListItemDto>>(`/api/product/find-my-store-products/${shop_id}`,{params:params});
  }

  addProduct(data: RegisterProductDto):Observable<void>{
    const formData = this.convertFormData.convertModelToFormData(data, null, null);
    return this.http.post<void>('/api/product/register-product',formData);
  }

  checkDuplicateBarcode(shop_id: string, barcode:string):Observable<boolean>{
    return this.http.get<boolean>('/api/product/check-duplicate-barcode/'+shop_id, {params:{barcode:barcode}});
  }
  findMemberProductGroup(product_group_id:string, data: RequestFindList):Observable<ResultFindList<MemberProductGroupDto>> {
    const params = new HttpParams({
      fromObject: {...data}
    });
    return this.http.get<ResultFindList<MemberProductGroupDto>>(`/api/product/find-product-in-group/${product_group_id}`,{params:params});
  }

  getInfoProduct(shop_id:string, product_id:string):Observable<ProductInfoDto>{
    return this.http.get<ProductInfoDto>(`/api/product/info-product/${shop_id}/${product_id}`);
  }

  updateProduct(data: UpdateProductInfoDto):Observable<void>{
    const formData = this.convertFormData.convertModelToFormData(data, null, null);
    return this.http.post<void>('/api/product/update-product',formData);
  }
}
