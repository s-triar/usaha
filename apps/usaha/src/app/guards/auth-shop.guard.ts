import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackService } from '../directives/back/back.service';
import { AuthShopStateService } from '../services/auth-shop-state.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthShopGuard implements CanActivate {
  constructor(
    private _localStrg:LocalStorageService,
    private _backService:BackService,
    private _shopAuth:AuthShopStateService
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._shopAuth.isTokenExpired()){
        this._shopAuth.loggedOut();
      }
      const token = this._localStrg.get('shop_access_token') ;
      if(token){
        return true;
      }
      else{
        this._backService.back('my-stores',true);
        return false;
      }
  }
  
}
