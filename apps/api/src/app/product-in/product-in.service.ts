import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductInDto, UserLoggedIn } from '@usaha/api-interfaces';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProductIn } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductInService {
    constructor(
        @InjectRepository(ProductIn)
        private _productInRepository: Repository<ProductIn>,
        private _hasherService:HashIdService,
        private _dataSource: DataSource
    ){}

    async create(userLoggedIn:UserLoggedIn, data: RegisterProductInDto):Promise<void>{
        const candidate: ProductIn ={
            id:0,
            n:data.n,
            product_id: this._hasherService.decrypt(data.product_id),
            price:data.price,
            created_at: new Date(),
            created_by_id: userLoggedIn.id,
            from: data.from
        };
        await this._productInRepository.save(candidate);
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterProductInDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ProductIn ={
            id:0,
            n:data.n,
            product_id: this._hasherService.decrypt(data.product_id),
            price:data.price,
            created_at: new Date(),
            created_by_id: userLoggedIn.id,
            from: data.from
        };
        if(queryRunner){
            await queryRunner.manager.save(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(candidate);
        
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
