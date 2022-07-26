import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {  ShopLoggedIn, ShopTokenPayload } from '@usaha/api-interfaces';
import { environment } from '../../environments/environment';
import { AuthUserService } from '../auth-user/auth-user.service';
// import { User } from '../../../typeorm/entities/auth';
import { HashIdService } from '../hash-id/hash-id.service';



@Injectable()
export class JwtShopStrategy extends PassportStrategy(Strategy,'jwt-shop') {
  constructor(
    private readonly _userAuthService: AuthUserService,
    private _hasherId: HashIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('Shop-Authorization'),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecretShopAuth,
    });
  }

  async validate(payload: ShopTokenPayload):Promise<ShopLoggedIn> {
    return {id:this._hasherId.decrypt(payload.sub)};
    // return await this._userAuthService.validateUser(payload.sub);
  }
}