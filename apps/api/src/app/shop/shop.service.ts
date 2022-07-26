import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultFindList, MyShopListItemDto, RegisterShopDto, UserLoggedIn } from '@usaha/api-interfaces';
import { Like, Repository } from 'typeorm';
import { Shop, ShopAddress, ShopType } from '../../typeorm/entities/application';
// import { CURRENT_SHOP, RequestWithShop } from '../auth/current-shop.module';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private _shopRepository: Repository<Shop>,
    @InjectRepository(ShopAddress) private _shopAddressRepository: Repository<ShopAddress>,
    private _hasher: HashIdService
  ) {}

  async create(userLoggedIn:UserLoggedIn, shop: RegisterShopDto) {
    
    if (!userLoggedIn) {
      throw new UnprocessableEntityException(
        'Need to login to register a shop'
      );
    }
    const {address, ...temp} = shop;
    
    
    const candidate: Shop = {
      ...temp,
      id: 0,
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
      owner_id: userLoggedIn.id,
    };
    const new_shop = await this._shopRepository.save(candidate);
    const addressTemp:ShopAddress={
      id:0,
      province:address.province,
      city:address.city,
      district:address.district,
      village:address.village,
      street:address.street,
      postal_code:address.postal_code,
      geo_map_location:address.geo_map_location,
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
      shop:new_shop
    };
    const new_shop_address = await this._shopAddressRepository.save(addressTemp);
    return await this._hasher.encrypt(new_shop.id);
  }

  findOneByHashedId(id: string): Promise<Shop> {
    const id_decode = this._hasher.decrypt(id);
    return this._shopRepository.findOneBy({ id: id_decode });
  }

  findOneWithShopCode(shop_code:string):Promise<Shop>{
    return this._shopRepository.findOneBy({shop_code:shop_code.trim().toLowerCase()});
  }

  async findMyShops(userLoggedIn:UserLoggedIn,name: string | null, page: number, pageSize:number): Promise<ResultFindList<MyShopListItemDto>> {
    if(!name){
      name='';
    }
    const [shops, countShops] = await this._shopRepository.findAndCount({
      where: [
        {
          owner_id: userLoggedIn.id,
          name: Like(`%${name}%`),
        },
        {
          owner_id: userLoggedIn.id,
          shop_code: Like(`%${name}%`),
        }
      ],
      order: {
        name: 'ASC',
      },
      skip:(page-1)*pageSize,
      take:pageSize,
      relations:['shop_type']
    });
    const shopsDto = shops.map((item) => {
      const temp: MyShopListItemDto = {
        id: this._hasher.encrypt(item.id),
        name: item.name,
        shop_type_name:item.shop_type.name,
        owned: item.owner_id === userLoggedIn.id,
        phone: item.phone,
        shop_code: item.shop_code,
      };
      return temp;
    });
    const result:ResultFindList<MyShopListItemDto>={
      items: shopsDto,
      count:countShops
    }
    return result;
  }
}
