import { Injectable } from '@nestjs/common';
import { ShopTypeService } from './shop-type.service';

@Injectable()
export class ShopTypeSeederService {
    constructor(
        private _shopTypeService: ShopTypeService
    ){}

    async seedShopType():Promise<void>{
        const shopTypes = await this._shopTypeService.findAll();
        if(shopTypes.length===0){
            await this._shopTypeService.create("Toko",null);
            await this._shopTypeService.create("Stall Makanan",null);
        }
    }
}
