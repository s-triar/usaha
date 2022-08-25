import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class ShopInterceptorInterceptor implements NestInterceptor {
  constructor(
    private _shopService: ShopService
  ){

  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    // const id = v4();

    const { params, query, body, headers, user } = request;
    // const { url, method } = request.raw;
    console.log(params, body, query, user);
    
    if(params && params['shop_id']){
      const check = this._shopService.checkAuthorizationShop(user,params['shop_id']);
      if(check){
        return next.handle();
      }
    }
    if(body && body['shop_id']){
      const check = this._shopService.checkAuthorizationShop(user,body['shop_id']);
      if(check){
        return next.handle();
      }
    }
    if(body && query['shop_id']){
      const check = this._shopService.checkAuthorizationShop(user,query['shop_id']);
      if(check){
        return next.handle();
      }
    }
    return next.handle().pipe(map(()=>throwError(()=> new Error('User does have any right to designated shop'))));
    // return next.handle().pipe(
    //   catchError(err => {
    //     // const { message: error, status, stack } = err;
    //     // const errorMessage = {
    //     //   id, type: 'error', method, url, params, query, body, headers,
    //     //   user: (user || {})._id, data: { error, status, stack },
    //     // };
    //     // console.log('err', err);
    //     return throwError(err);
    //   }));;
  }
}
