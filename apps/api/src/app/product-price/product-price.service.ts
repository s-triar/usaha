import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductPriceDto, UserLoggedIn } from '@usaha/api-interfaces';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProductPrice } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductPriceService {
    constructor(
        @InjectRepository(ProductPrice) private _productPriceRepository: Repository<ProductPrice>,
        private _hasher: HashIdService,
        private _dataSource: DataSource
    ){}
    async create(userLoggedIn:UserLoggedIn, data: RegisterProductPriceDto):Promise<void>{
        const candidate: ProductPrice = {
            id:0,
            product_id: this._hasher.decrypt(data.product_id),
            price:data.price,
            is_auto_wholesale_price:data.isAutoUseWholeSale,
            min_wholesale_price:data.minWholeSalePrice,
            wholesale_price:data.wholeSalePrice,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        }
        await this._productPriceRepository.save(candidate);
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterProductPriceDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ProductPrice = {
            id:0,
            product_id: this._hasher.decrypt(data.product_id),
            price:data.price,
            is_auto_wholesale_price:data.isAutoUseWholeSale,
            min_wholesale_price:data.minWholeSalePrice,
            wholesale_price:data.wholeSalePrice,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        };
        if(queryRunner){
            await queryRunner.manager.getRepository(ProductPrice).save<ProductPrice>(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(ProductPrice).save<ProductPrice>(candidate);
        
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
