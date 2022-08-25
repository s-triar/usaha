import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterProductStockDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductStockService {

  constructor(
    private _http:HttpClient
  ) { }

  addStock(data:RegisterProductStockDto):Observable<void>{
    return this._http.post<void>('/api/product-stock/register-product-stock',data);
  }
}
