import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthShopInterceptor implements NestInterceptor {
  constructor(
    private _jwtService: JwtService,
  ){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const shop_token= req.headers['shop-authorization'] ;

    return next.handle();
  }
}
