import { Injectable } from '@angular/core';
import { UserDto, UserTokenPayload } from '@usaha/api-interfaces';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  jwtToken: string | null = null;
  decodedToken: UserTokenPayload | null = null;
  user$: BehaviorSubject<UserDto|null> = new BehaviorSubject<UserDto|null>(null);

  constructor(
    private _localStrg: LocalStorageService,
    private _authService: AuthService
  ) {}

  loggedIn(token:string){
    this.setToken(token);
  }
  loggedOut(){
    this.setToken(null);
  }

  setToken(token: string|null) {
    if (token) {
      this.jwtToken = token;
      this._localStrg.set('access_token', token);
      this.decodeToken();
      this.loadMyProfile();
    }
    else{
      this.jwtToken = null;
      this._localStrg.remove('access_token');
      this.user$.next(null);
    }
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  loadMyProfile(){
    const token = this._localStrg.get('access_token');
    if(token){
      this.jwtToken = token;
      this.decodeToken();
      this._authService.myProfile().subscribe(x=>this.user$.next(x));
    }else{
      this.jwtToken = null;
      this.user$.next(null);
    }
  }

  getDecodeToken() {
    return this.decodedToken;
  }

  getUser() {
    return this.user$.asObservable();
  }

  getExpiryTime() {
    return this.decodedToken ? this.decodedToken.exp : null;
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
