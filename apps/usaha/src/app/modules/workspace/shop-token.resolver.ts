import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ShopTokenDto } from '@usaha/api-interfaces';
import { map, Observable, of } from 'rxjs';
import { ShopService } from '../../services/shop.service';

@Injectable({
  providedIn: 'root'
})
export class ShopTokenResolver implements Resolve<string|undefined> {

  constructor(private _shopService:ShopService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string|undefined> {
    const t = route.params['shop_id'];
    console.log("params shop_id", t);
    
    return this._shopService.getShopToken(t).pipe(map(x=>x?t:undefined));
    
  }
}
