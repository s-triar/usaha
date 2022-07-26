import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopTypeDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopTypeService {

  constructor(private http:HttpClient) { }

  getAllShopType():Observable<ShopTypeDto[]>{
    return this.http.get<ShopTypeDto[]>('/api/shop-type/get-all-shop-type');
  }
}
