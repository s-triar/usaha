import { Controller, Get } from '@nestjs/common';
import { ShopTypeDto } from '@usaha/api-interfaces';
import { ShopTypeService } from './shop-type.service';

@Controller('shop-type')
export class ShopTypeController {

    constructor(private _shopTypeService: ShopTypeService){}

    @Get('get-all-shop-type')
    async getAllShopType(): Promise<ShopTypeDto[]> {
      const temp = await this._shopTypeService.findAll();
      const res = temp.map(x=>{
        const t:ShopTypeDto={
            id:x.id,
            name:x.name
        };
        return t;
      })
      return res;
    }
}
