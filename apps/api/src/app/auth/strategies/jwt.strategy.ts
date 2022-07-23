import { ExtractJwt,Strategy  } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {  UserLoggedIn, UserTokenPayload } from '@usaha/api-interfaces';
import { environment } from '../../../environments/environment';
import { UserAuthService } from '../services/user-auth/user-auth.service';
// import { User } from '../../../typeorm/entities/auth';
import { HashIdService } from '../../hash-id/hash-id.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _userAuthService: UserAuthService,
    private _hasherId: HashIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecretAuth
    });
  }

  async validate(payload: UserTokenPayload):Promise<UserLoggedIn> {
    console.log("FROM VALIDATE JWT STRAT");
    
    return {id:this._hasherId.decrypt(payload.sub)};
    // return await this._userAuthService.validateUser(payload.sub);
  }
}