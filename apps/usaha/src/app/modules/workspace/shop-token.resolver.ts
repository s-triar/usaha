import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ShopTokenDto } from '@usaha/api-interfaces';
import { Observable, of } from 'rxjs';
import { ShopService } from '../../services/shop.service';

@Injectable({
  providedIn: 'root'
})
export class ShopTokenResolver implements Resolve<ShopTokenDto> {

  constructor(private _shopService:ShopService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShopTokenDto> {
    const t = route.params['shop_id'];
  
    return this._shopService.getShopToken(t);
    
  }
}
