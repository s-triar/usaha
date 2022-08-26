import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultFindList, MyShopListItemDto, RegisterShopDto, UserLoggedIn, RegisterShopPhotoDto, RegisterShopAddressDto } from '@usaha/api-interfaces';
import { DataSource, Like, Repository } from 'typeorm';
import { Shop } from '../../typeorm/entities/application';
// import { CURRENT_SHOP, RequestWithShop } from '../auth/current-shop.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopAddressService } from '../shop-address/shop-address.service';
import { ShopPhotoService } from '../shop-photo/shop-photo.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private _shopRepository: Repository<Shop>,
    private _hasher: HashIdService,
    private _dataSource: DataSource,
    private _shopPhotoService: ShopPhotoService,
    private _shopAddressService: ShopAddressService
  ) {}

  async createTransaction(userLoggedIn:UserLoggedIn, shop: RegisterShopDto, photo_data: RegisterShopPhotoDto):Promise<void> {
    if (!userLoggedIn) {
      throw new UnprocessableEntityException(
        'Need to login to register a shop'
      );
    }
    

    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error=null;
    try {
      const candidate: Shop = {
        name:shop.name,
        phone:shop.phone,
        shop_code:shop.shop_code,
        email:shop.email,
        shop_type_id:shop.shop_type_id,
        id: 0,
        created_at: new Date(),
        created_by_id: userLoggedIn.id,
        owner_id: userLoggedIn.id,
      };
      const new_shop = await queryRunner.manager.getRepository(Shop).save<Shop>(candidate);

      const new_shop_id_hashed = this._hasher.encrypt(new_shop.id);
      
      const addressTemp:RegisterShopAddressDto={
        province:shop.province,
        city:shop.city,
        district:shop.district,
        village:shop.village,
        street:shop.street,
        postal_code:shop.postal_code,
        geo_map_location:shop.geo_map_location,
        shop_id:new_shop_id_hashed
      };
      await this._shopAddressService.createTransaction(userLoggedIn,addressTemp, queryRunner);
  
      photo_data.shop_id = new_shop_id_hashed;
      await this._shopPhotoService.createTransaction(userLoggedIn, photo_data, queryRunner);
      
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    if(error){
      throw error;
    }
  }


  async create(userLoggedIn:UserLoggedIn, shop: RegisterShopDto, photo_data: RegisterShopPhotoDto):Promise<void> {
    
    if (!userLoggedIn) {
      throw new UnprocessableEntityException(
        'Need to login to register a shop'
      );
    }
    const candidate: Shop = {
      name:shop.name,
      phone:shop.phone,
      shop_code:shop.shop_code,
      email:shop.email,
      shop_type_id:shop.shop_type_id,
      id: 0,
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
      owner_id: userLoggedIn.id,
    };
    const new_shop = await this._shopRepository.save(candidate);
    // const new_shop_address = await this._shopAddressRepository.save(addressTemp);
    const new_shop_id_hashed = this._hasher.encrypt(new_shop.id);

    const addressTemp:RegisterShopAddressDto={
      province:shop.province,
      city:shop.city,
      district:shop.district,
      village:shop.village,
      street:shop.street,
      postal_code:shop.postal_code,
      geo_map_location:shop.geo_map_location,
      shop_id:new_shop_id_hashed
    };
    await this._shopAddressService.create(userLoggedIn,addressTemp);

    photo_data.shop_id = new_shop_id_hashed;
    await this._shopPhotoService.create(userLoggedIn, photo_data);

  }

  findOneByHashedId(id: string): Promise<Shop> {
    const id_decode = this._hasher.decrypt(id);
    if(!id_decode){
      throw new UnprocessableEntityException('Id is not recognized');
    }
    return this._shopRepository.findOneBy({ id: id_decode });
  }

  findOneWithShopCode(shop_code:string):Promise<Shop>{
    return this._shopRepository.findOneBy({shop_code:shop_code.trim().toLowerCase()});
  }

  async checkAuthorizationShop(userLoggedIn: UserLoggedIn, shopIdentifier: string):Promise<boolean> {
    if (userLoggedIn) {
      const shop = await this.findOneByHashedId(shopIdentifier);
      
      if(shop && shop.owner_id == userLoggedIn.id){
        return true;
      }else{
        return false;
        // throw new UnauthorizedException('You do not have any right to access this store.');
      }
    }
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
