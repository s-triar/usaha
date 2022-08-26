import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyShopListItemDto, RegisterShopDto, RequestFindList, ResultFindList, ShopTokenDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';
import { FormConversionService } from './form-conversion.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private http:HttpClient,
    private convertFormData: FormConversionService

    ) { }

  getShopToken(identifier:string):Observable<boolean>{
    return this.http.post<boolean>('/api/shop/login',{identifier:identifier});
  }

  checkDuplicateShopCode(shop_code:string):Observable<boolean>{
    return this.http.get<boolean>('/api/shop/check-if-shop-code-duplicate',{params:{shop_code:shop_code}});
  }
  registerShop(payload:RegisterShopDto):Observable<void>{
    const formData = this.convertFormData.convertModelToFormData(payload, null, null);
    return this.http.post<void>('/api/shop/register-shop',formData);
  }
  findMyShops(payload: RequestFindList):Observable<ResultFindList<MyShopListItemDto>>{
    const params = new HttpParams({
      fromObject: {...payload}
    });
    return this.http.get<ResultFindList<MyShopListItemDto>>('/api/shop/find-my-shops',{params:params});
  }
}
