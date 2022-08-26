import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterShopPhotoDto, UserLoggedIn } from '@usaha/api-interfaces';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ShopPhoto } from '../../typeorm/entities/application/shop-photo.entity';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ShopPhotoService {
    constructor(
        @InjectRepository(ShopPhoto) private _shopPhoto: Repository<ShopPhoto>,
        private _hasher: HashIdService,
        private _dataSource: DataSource
    ){}
    async create(userLoggedIn: UserLoggedIn, data: RegisterShopPhotoDto):Promise<void>{
        const candidate: ShopPhoto={
            id:0,
            shop_id:this._hasher.decrypt(data.shop_id),
            url: data.path,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        };
        await this._shopPhoto.save(candidate);
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterShopPhotoDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ShopPhoto={
            id:0,
            shop_id:this._hasher.decrypt(data.shop_id),
            url: data.path,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        };
        if(queryRunner){
            await queryRunner.manager.getRepository(ShopPhoto).save<ShopPhoto>(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(ShopPhoto).save<ShopPhoto>(candidate);
        
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
