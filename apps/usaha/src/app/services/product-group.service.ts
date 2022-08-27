import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyShopProductGroupDto, RegisterProductGroupDto, RequestFindList, RequestFindListShopEntity, ResultFindList } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  constructor(
    private _http:HttpClient
  ) { }

  checkIfGroupNameExist(name:string, shop_id:string):Observable<boolean>{
    return this._http.get<boolean>('/api/product-group/check-if-group-exist',{params:{name:name, shop_id:shop_id}});
  }

  findMyShopProductGroups(name:string, shop_id:string, page:number, pageSize:number):Observable<ResultFindList<MyShopProductGroupDto>>{
    const reqfl: RequestFindList = {
      name:name,
      page:page,
      pageSize:pageSize,
    };
    const param = new HttpParams({
      fromObject:{...reqfl}
    });
    return this._http.get<ResultFindList<MyShopProductGroupDto>>(`/api/product-group/find-my-shop-product-groups/${shop_id}`,{params:param})
  }
  
  createProductGroup(data:RegisterProductGroupDto):Observable<void>{
    return this._http.post<void>('/api/product-group/register-product-group',data);
  }

}
