import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtShopAuthGuard extends AuthGuard('jwt-shop'){}
