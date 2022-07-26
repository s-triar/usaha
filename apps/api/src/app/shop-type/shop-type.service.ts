import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { ShopType } from '../../typeorm/entities/application';

@Injectable()
export class ShopTypeService {

    constructor(
        @InjectRepository(ShopType) private _shopTypeRepository: Repository<ShopType>,
    ){}

    async create(name:string, user_create_id:number|null):Promise<number>{
        const candidate: ShopType={
            id:0,
            name:name,
            created_by_id:user_create_id,
            created_at: new Date()
        }
        const new_shop_type = await this._shopTypeRepository.save(candidate);
        return new_shop_type.id;
    }

    findAll(): Promise<ShopType[]>{
        return this._shopTypeRepository.find();
    }

}
