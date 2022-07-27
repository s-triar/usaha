import { ExtractJwt,Strategy  } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUserService } from './auth-user.service';
import { HashIdService } from '../hash-id/hash-id.service';
import { environment } from '../../environments/environment';
import { UserLoggedIn, UserTokenPayload } from '@usaha/api-interfaces';


@Injectable()
export class AuthUserStrategy extends PassportStrategy(Strategy,'jwt-user') {
  constructor(
    private readonly _userAuthService: AuthUserService,
    private _hasherId: HashIdService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecretAuth,
    });
    // this.name='jwt';
  }

  async validate(payload: UserTokenPayload):Promise<UserLoggedIn> {
    console.log(payload.sub,"auth user");
    
    return {id:this._hasherId.decrypt(payload.sub)};
    // return await this._userAuthService.validateUser(payload.sub);
  }
}