import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ProductInfoDto } from '@usaha/api-interfaces';
import { map, Observable, of } from 'rxjs';
import { ProductService } from '../../../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductInfoResolver implements Resolve<ProductInfoDto|undefined> {
  constructor(private _productService:ProductService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductInfoDto|undefined> {
    const shop_id = route.params['shop_id'];
    const product_id = route.params['product_id'];
    return this._productService.getInfoProduct(shop_id,product_id).pipe(map(x=>x?x:undefined));
    
  }
}
