import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductStockDto, UserLoggedIn } from '@usaha/api-interfaces';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProductStock } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductStockService {
    constructor(
        @InjectRepository(ProductStock) private _productStockRepository: Repository<ProductStock>,
        private _hasher: HashIdService,
        private _dataSource: DataSource
    ){}

    async create(userLoggedIn:UserLoggedIn, data: RegisterProductStockDto):Promise<void>{
        const candidate: ProductStock = {
            id:0,
            product_id: this._hasher.decrypt(data.product_id),
            n: data.n,
            description: data.description,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        }
        await this._productStockRepository.save(candidate);
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterProductStockDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ProductStock = {
            id:0,
            product_id: this._hasher.decrypt(data.product_id),
            n: data.n,
            description: data.description,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        }
        if(queryRunner){
            await queryRunner.manager.getRepository(ProductStock).save<ProductStock>(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(ProductStock).save<ProductStock>(candidate);
        
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
