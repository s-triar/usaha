import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ShopTokenDto, ShopTokenPayload, UserLoggedIn } from '@usaha/api-interfaces';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class ShopAuthService {

    constructor(
        private _shopService: ShopService,
        private _hasherIdService: HashIdService,
        private _jwtService: JwtService,


    ){

    }


    async login(userLoggedIn: UserLoggedIn, shopIdentifier: string):Promise<ShopTokenDto|null> {
        if (userLoggedIn) {
          const shop = await this._shopService.findOneByHashedId(shopIdentifier);
          if(shop && shop.owner_id == userLoggedIn.id){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id,...result } = shop;
            const payload:ShopTokenPayload = { sub: this._hasherIdService.encrypt(id) };
            return {
              // access_token: this.jwtService.sign(payload, {secret: this.configService.get('JWT_SECRET_KEY',{infer:true})}),
              shop_access_token: await this._jwtService.sign(payload)
            };
          }
        }
        return null;

        
      }
}
