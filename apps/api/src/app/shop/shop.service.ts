import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyShopListDto, MyShopListItemDto, RegisterShopDto } from '@usaha/api-interfaces';
import { Like, Repository } from 'typeorm';
import { Shop } from '../../typeorm/entities/application';
// import { CURRENT_SHOP, RequestWithShop } from '../auth/current-shop.module';
import { CURRENT_USER, RequestWithUser } from '../auth/current-user.module';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private _shopRepository: Repository<Shop>,
    @Inject(CURRENT_USER) private readonly _currentUser: RequestWithUser,
    // @Inject(CURRENT_SHOP) private readonly _currentShop: RequestWithShop,
    private _hasher: HashIdService
  ) {}

  async create(shop: RegisterShopDto) {
    const user_create = this._currentUser.user;
    if (!user_create) {
      throw new UnprocessableEntityException(
        'Need to login to register a shop'
      );
    }
    const candidate: Shop = {
      ...shop,
      id: 0,
      created_at: new Date(),
      created_by_id: user_create.id,
      owner_id: user_create.id,
    };
    const new_shop = await this._shopRepository.save(candidate);
    return await this._hasher.encrypt(new_shop.id);
  }

  findOneByHashedId(id: string): Promise<Shop> {
    const id_decode = this._hasher.decrypt(id);
    return this._shopRepository.findOneBy({ id: id_decode });
  }

  async findMyShops(name: string | null, page: number, pageSize:number): Promise<MyShopListDto> {
    const userLoggedIn = this._currentUser.user;
    if(!name){
      name='';
    }
    const [shops, countShops] = await this._shopRepository.findAndCount({
      where: {
            owner_id: userLoggedIn.id,
            name: Like(`%${name}%`),
          },
      order: {
        name: 'ASC',
      },
      skip:(page-1)*pageSize,
      take:pageSize
    });
    const shopsDto = shops.map((item) => {
      const temp: MyShopListItemDto = {
        id: this._hasher.encrypt(item.id),
        name: item.name,
        owned: item.owner_id === userLoggedIn.id,
        phone: item.phone,
        shop_code: item.shop_code,
      };
      return temp;
    });
    const result:MyShopListDto={
      items: shopsDto,
      count:countShops
    }
    return result;
  }
}
