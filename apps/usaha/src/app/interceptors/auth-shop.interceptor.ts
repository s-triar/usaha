import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthShopInterceptor implements HttpInterceptor {

  constructor(
    private _localStrg:LocalStorageService

  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._localStrg.get('shop_access_token');
    if (token){
      req = req.clone({
        setHeaders: {
          'Shop-Authorization': `${token}`
        }
      });
    }
    return next.handle(req);
  }
}
