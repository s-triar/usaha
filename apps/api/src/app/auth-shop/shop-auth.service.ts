import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopTokenDto, ShopTokenPayload, UserLoggedIn } from '@usaha/api-interfaces';
import { Repository } from 'typeorm/repository/Repository';
import { Shop } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ShopAuthService {

    constructor(
      @InjectRepository(Shop) private _shopRepository: Repository<Shop>,
        private _hasherIdService: HashIdService,
        private _jwtService: JwtService,


    ){

    }
    findOneByHashedId(id: string): Promise<Shop> {
      const id_decode = this._hasherIdService.decrypt(id);
      if(!id_decode){
        throw new UnprocessableEntityException('Id is not recognized');
      }
      return this._shopRepository.findOneBy({ id: id_decode });
    }

    async login(userLoggedIn: UserLoggedIn, shopIdentifier: string):Promise<ShopTokenDto|null> {
        if (userLoggedIn) {
          const shop = await this.findOneByHashedId(shopIdentifier);
          
          if(shop && shop.owner_id == userLoggedIn.id){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id,...result } = shop;
            const payload:ShopTokenPayload = { sub: this._hasherIdService.encrypt(id) };
            return {
              // access_token: this.jwtService.sign(payload, {secret: this.configService.get('JWT_SECRET_KEY',{infer:true})}),
              shop_access_token: await this._jwtService.sign(payload)
            };
          }else{
            throw new UnauthorizedException('You do not have any right to access this store.');
          }
        }
        

        
      }
}
