import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from '../../typeorm/entities/application';

@Injectable()
export class ProductTypeService {

    constructor(
        @InjectRepository(ProductType) private _productTypeRepository: Repository<ProductType>
    ){

    }

    findAll(): Promise<ProductType[]>{
        return this._productTypeRepository.find();
    }
    findEachLevel(parent_id:number):Promise<ProductType[]>{
        return this._productTypeRepository.findBy({product_type_parent_id:parent_id==0?null:parent_id});
    }

    async create(id:number, name:string, parent_id:number|null):Promise<number>{
        const candidate: ProductType={
            id:id,
            name:name,
            product_type_parent_id: parent_id
        }
        const new_Product_type = await this._productTypeRepository.save(candidate);
        return new_Product_type.id;
    }



}
