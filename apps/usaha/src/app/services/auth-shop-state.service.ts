import { Injectable } from '@angular/core';
import { ShopTokenPayload } from '@usaha/api-interfaces';
import { LocalStorageService } from './local-storage.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthShopStateService {
  jwtShopToken: string | null = null;
  decodedShopToken: ShopTokenPayload | null = null;
  constructor(
    private _localStrg: LocalStorageService,
  ) {
    const temp = this._localStrg.get('shop_access_token');
    this.setToken(temp);
  }
  loggedIn(token:string){
    this.setToken(token);
  }
  loggedOut(){
    this.setToken(null);
  }
  setToken(token: string|null) {
    if (token) {
      this.jwtShopToken = token;
      this._localStrg.set('shop_access_token', token);
      this.decodeToken();
    }
    else{
      this.jwtShopToken = null;
      this._localStrg.remove('shop_access_token');
    }
  }
  decodeToken() {
    if (this.jwtShopToken) {
      this.decodedShopToken = jwt_decode(this.jwtShopToken);
    }
  }
  getDecodeToken() {
    return this.decodedShopToken;
  }
  getExpiryTime() {
    return this.decodedShopToken ? this.decodedShopToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number|null|undefined = this.getExpiryTime();
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }
}
