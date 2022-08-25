import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductTypeDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  constructor(
    private _http: HttpClient
  ) { }

  getAllProductType():Observable<ProductTypeDto[]>{
    return this._http.get<ProductTypeDto[]>('/api/product-type/get-all-product-type');
  }

  getAllProductTypeEachLevel(parent_id:number):Observable<ProductTypeDto[]>{
    const params = new HttpParams({
      fromObject: {parent_id:parent_id}
    });
    return this._http.get<ProductTypeDto[]>('/api/product-type/get-all-product-type',{params});
  }
  

}
