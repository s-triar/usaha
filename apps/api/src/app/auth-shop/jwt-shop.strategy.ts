import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {  ShopLoggedIn, ShopTokenPayload } from '@usaha/api-interfaces';
import { environment } from '../../environments/environment';
// import { User } from '../../../typeorm/entities/auth';
import { HashIdService } from '../hash-id/hash-id.service';


@Injectable()
export class JwtShopStrategy extends PassportStrategy(Strategy,'jwt-shop') {
  constructor(
    private _hasherId: HashIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('shop-authorization'),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   req => {
      //     let token = null;
      //     console.log(req.headers);
          
      //     if (req && req.headers) {
      //       token = req.headers['shop-authorization'];
      //       console.log(token);
            
      //     }
      //     return token;
      //   },
      // ]),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecretShopAuth,
    });

  }

  

  async validate(payload: ShopTokenPayload):Promise<ShopLoggedIn> {
    console.log(payload.sub,"auth shop");
    
    return {id:this._hasherId.decrypt(payload.sub)};
    // return await this._userAuthService.validateUser(payload.sub);
  }
}