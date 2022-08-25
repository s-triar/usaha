import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterProductInDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductInService {

  constructor(
    private _http:HttpClient
  ) { }

  addStock(data:RegisterProductInDto):Observable<void>{
    return this._http.post<void>('/api/product-in/register-product-in',data);
  }

}
