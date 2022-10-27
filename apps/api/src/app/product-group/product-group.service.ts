import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MyShopProductGroupDto,
  ResultFindList,
  UserLoggedIn,
} from '@usaha/api-interfaces';
import { Repository, Like, In, DataSource, QueryRunner } from 'typeorm';
import { Product, ProductGroup } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup)
    private _productGroupRepository: Repository<ProductGroup>,
    private _hashIdService: HashIdService,
    private _dataSource: DataSource
  ) {}

  async addMemberProductGroup(
    product_group_id: string,
    product: Product
  ): Promise<void> {
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({
      id: product_group_id_int,
    });
    group.members.push(product);
    await this._productGroupRepository.update(
      { id: product_group_id_int },
      { members: group.members }
    );
  }

  async addMemberProductGroupTransaction(
    userLoggedIn: UserLoggedIn,
    product_group_id: string,
    product: Product,
    queryRunner: QueryRunner | null
  ): Promise<void> {
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({
      id: product_group_id_int,
    });
    group.members.push(product);
    if (queryRunner) {
      await queryRunner.manager
        .getRepository(ProductGroup)
        .update({ id: product_group_id_int }, { members: group.members });
      return;
    }
    queryRunner = this._dataSource.createQueryRunner();
    let error = null;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(ProductGroup)
        .update({ id: product_group_id_int }, { members: group.members });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    if (error) {
      throw error;
    }
  }

  async removeMemberProductGroup(
    product_group_id: string,
    product: Product
  ): Promise<void> {
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({
      id: product_group_id_int,
    });
    const temp = group.members.findIndex((x) => {
      x.id == product.id;
    });
    if (temp > -1) {
      group.members.splice(temp, 1);
      await this._productGroupRepository.update(
        { id: product_group_id_int },
        { members: group.members }
      );
    }
  }
  async removeMemberProductGroupTransaction(
    userLoggedIn: UserLoggedIn,
    product_group_id: string,
    product: Product,
    queryRunner: QueryRunner | null
  ): Promise<void> {
    const product_group_id_int = this._hashIdService.decrypt(product_group_id);
    const group = await this._productGroupRepository.findOneBy({
      id: product_group_id_int,
    });
    const temp = group.members.findIndex((x) => {
      x.id == product.id;
    });
    if (temp > -1) {
      group.members.splice(temp, 1);
      if (queryRunner) {
        await queryRunner.manager
          .getRepository(ProductGroup)
          .update({ id: product_group_id_int }, { members: group.members });
        return;
      }
      queryRunner = this._dataSource.createQueryRunner();
      let error = null;
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager
          .getRepository(ProductGroup)
          .update({ id: product_group_id_int }, { members: group.members });

        await queryRunner.commitTransaction();
      } catch (err) {
        // since we have errors lets rollback the changes we made
        await queryRunner.rollbackTransaction();
        error = err;
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
      if (error) {
        throw error;
      }
    }
  }

  async findGroupWithIds(ids: number[]): Promise<ProductGroup[]> {
    return await this._productGroupRepository.find({
      where: {
        id: In(ids),
      },
    });
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
    const result: ResultFindList<MyShopProductGroupDto> = {
      count: countGroups,
      items: groupsDto,
    };
    return result;
  }

  async create(
    name: string,
    shop_id: string,
    description: string | null,
    userLoggedIn: UserLoggedIn
  ): Promise<void> {
    name = name.trim().toLowerCase();
    const candidate: ProductGroup = {
      id: 0,
      description: description,
      name: name,
      shop_id: this._hashIdService.decrypt(shop_id),
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
    };
    await this._productGroupRepository.save(candidate);
    // this._hashIdService.encrypt(new_product_group.id);
  }

  async createTransaction(
    userLoggedIn: UserLoggedIn,
    name: string,
    shop_id: string,
    description: string | null,
    queryRunner: QueryRunner | null
  ): Promise<void> {
    const candidate: ProductGroup = {
      id: 0,
      description: description,
      name: name,
      shop_id: this._hashIdService.decrypt(shop_id),
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
    };
    if (queryRunner) {
      await queryRunner.manager
        .getRepository(ProductGroup)
        .save<ProductGroup>(candidate);
      return;
    }
    queryRunner = this._dataSource.createQueryRunner();
    let error = null;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(ProductGroup)
        .save<ProductGroup>(candidate);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    if (error) {
      throw error;
    }
  }
}
