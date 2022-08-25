import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterProductPriceDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductPriceService {

  constructor(
    private _http:HttpClient
  ) { }

  addPrice(data:RegisterProductPriceDto):Observable<void>{
    return this._http.post<void>('/api/product-price/register-product-price',data);
  }
}
