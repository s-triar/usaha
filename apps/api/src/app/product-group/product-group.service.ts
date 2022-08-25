import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MyShopProductGroupDto,
  ResultFindList,
  UserLoggedIn,
} from '@usaha/api-interfaces';
import { Repository, Like, In } from 'typeorm';
import { Product, ProductGroup } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup) private _productGroupRepository: Repository<ProductGroup>,
    private _hashIdService: HashIdService
  ) {}

  async addMemberProductGroup(product_group_id:string, product: Product):Promise<void>{
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({id:product_group_id_int});
    group.members.push(product)
    await this._productGroupRepository.update({id:product_group_id_int},{members:group.members});
  }

  async removeMemberProductGroup(product_group_id:string, product: Product):Promise<void>{
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({id:product_group_id_int});
    const temp = group.members.findIndex(x=>{
      x.id==product.id
    });
    if(temp > -1){
      group.members.splice(temp,1);
      await this._productGroupRepository.update({id:product_group_id_int},{members:group.members});
    }
  }

  async findGroupWithIds(ids:number[]): Promise<ProductGroup[]>{
    return await this._productGroupRepository.find({
      where:{
        id: In(ids)
      }
    })
  }

  async findGroupWithName(
    name: string,
    shop_id: string
  ): Promise<ProductGroup | null> {
    name = name.trim().toLowerCase();
    const shop_id_int: number = this._hashIdService.decrypt(shop_id);
    const data = await this._productGroupRepository.findOneBy({
      name: name,
      shop_id: shop_id_int,
    });
    return data;
  }

  async findMyStoreProductGroups(
    name: string,
    shop_id: string,
    page: number,
    pageSize: number
  ): Promise<ResultFindList<MyShopProductGroupDto>> {
    const shop_id_int: number = this._hashIdService.decrypt(shop_id);
    if (!name) {
      name = '';
    }
    const [groups, countGroups] =
      await this._productGroupRepository.findAndCount({
        where: [
          {
            shop_id: shop_id_int,
            name: Like(`%${name}%`),
          },
        ],
        order: {
          name: 'ASC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        // relations: ['shop'],
      });
    const groupsDto = groups.map((item) => {
      const temp: MyShopProductGroupDto = {
        id: this._hashIdService.encrypt(item.id),
        name: item.name,
      };
      return temp;
    });
    const result: ResultFindList<MyShopProductGroupDto>= {
        count:countGroups,
        items:groupsDto
    }
    return result;
  }

  async create(
    name: string,
    shop_id: string,
    description:string|null,
    userLoggedIn: UserLoggedIn
  ): Promise<void> {
    name = name.trim().toLowerCase();
    const candidate: ProductGroup = {
      id: 0,
      description:description,
      name: name,
      shop_id: this._hashIdService.decrypt(shop_id),
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
    };
    await this._productGroupRepository.save(
      candidate
    );
    // this._hashIdService.encrypt(new_product_group.id);
  }
}
