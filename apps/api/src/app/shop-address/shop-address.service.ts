import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterShopAddressDto, UserLoggedIn } from '@usaha/api-interfaces';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { ShopAddress } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ShopAddressService {
    constructor(
        @InjectRepository(ShopAddress) private _shopAddressRepository: Repository<ShopAddress>,
        private _hasher: HashIdService,
        private _dataSource: DataSource
    ){}

    async create(userLoggedIn:UserLoggedIn, data: RegisterShopAddressDto):Promise<void>{
        const candidate: ShopAddress = {
            id:0,
            city:data.city,
            district:data.district,
            postal_code:data.postal_code,
            province:data.province,
            street:data.street,
            village:data.village,
            geo_map_location:data.geo_map_location,
            shop_id:this._hasher.decrypt(data.shop_id),
            created_at: new Date(),
            created_by_id: userLoggedIn.id,
        }
        await this._shopAddressRepository.manager.transaction(async manager=>{
            manager.save(candidate);
        });
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterShopAddressDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ShopAddress = {
            id:0,
            city:data.city,
            district:data.district,
            postal_code:data.postal_code,
            province:data.province,
            street:data.street,
            village:data.village,
            geo_map_location:data.geo_map_location,
            shop_id:this._hasher.decrypt(data.shop_id),
            created_at: new Date(),
            created_by_id: userLoggedIn.id,
        }
        if(queryRunner){
            await queryRunner.manager.getRepository(ShopAddress).save<ShopAddress>(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(ShopAddress).save<ShopAddress>(candidate);
        
            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            error=err
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
        if(error){
            throw error;
        }

    }

}
