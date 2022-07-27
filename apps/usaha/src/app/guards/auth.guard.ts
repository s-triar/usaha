import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BackService } from '../directives/back/back.service';
import { AuthStateService } from '../services/auth-state.service';

import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
  // deps:[BackService]
})
export class AuthGuard implements CanActivate {
  constructor(
    private _localStrg: LocalStorageService,
    private _backService: BackService,
    private _authService: AuthStateService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._authService.isTokenExpired()) {
      this._authService.loggedOut();
    }
    const token = this._localStrg.get('access_token');
    if (token) {
      return true;
    } else {
      this._backService.back('auth', true);
      return false;
    }
  }
}
