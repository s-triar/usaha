import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getMyStoreProducts():Observable<void>{
    return this.http.get<void>('/api/product/find-my-store-products');
  }
}
