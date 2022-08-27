import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductPhotoDto, UserLoggedIn } from '@usaha/api-interfaces';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProductPhoto } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class ProductPhotoService {
    constructor(
        @InjectRepository(ProductPhoto) private _productPhoto: Repository<ProductPhoto>,
        private _hasher: HashIdService,
        private _dataSource: DataSource
    ){}

    async create(userLoggedIn: UserLoggedIn, data: RegisterProductPhotoDto):Promise<void>{
        const candidate: ProductPhoto={
            id:0,
            product_id:this._hasher.decrypt(data.product_id),
            url: data.path,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        };
        await this._productPhoto.save(candidate);
    }
    async createTransaction(userLoggedIn: UserLoggedIn, data: RegisterProductPhotoDto, queryRunner: QueryRunner|null):Promise<void>{
        const candidate: ProductPhoto={
            id:0,
            product_id:this._hasher.decrypt(data.product_id),
            url: data.path,
            created_at: new Date(),
            created_by_id: userLoggedIn.id
        };
        if(queryRunner){
            await queryRunner.manager.getRepository(ProductPhoto).save<ProductPhoto>(candidate);
            return;
        }
        queryRunner = this._dataSource.createQueryRunner();
        let error=null;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(ProductPhoto).save<ProductPhoto>(candidate);
        
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
