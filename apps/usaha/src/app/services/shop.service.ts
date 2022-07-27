import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyShopListItemDto, RegisterShopDto, RequestFindList, ResultFindList, ShopTokenDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http:HttpClient) { }

  getShopToken(identifier:string):Observable<ShopTokenDto>{
    return this.http.post<ShopTokenDto>('/api/shop/login',{identifier:identifier});
  }

  checkDuplicateShopCode(shop_code:string):Observable<boolean>{
    return this.http.get<boolean>('/api/shop/check-if-shop-code-duplicate',{params:{shop_code:shop_code}});
  }
  registerShop(payload:RegisterShopDto):Observable<void>{
    return this.http.post<void>('/api/shop/register-shop',payload);
  }
  findMyShops(payload: RequestFindList):Observable<ResultFindList<MyShopListItemDto>>{
    return this.http.post<ResultFindList<MyShopListItemDto>>('/api/shop/find-my-shops',payload);
  }
}
