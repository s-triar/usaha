import { Controller, Get, Query } from '@nestjs/common';
import { ProductTypeDto } from '@usaha/api-interfaces';
import { ProductTypeService } from './product-type.service';

@Controller('product-type')
export class ProductTypeController {
  constructor(private _productTypeService: ProductTypeService) {}

  @Get('get-all-product-type')
  async getAllProductType(): Promise<ProductTypeDto[]> {
    const temp = await this._productTypeService.findAll();
    const res = temp.map((x) => {
      const t: ProductTypeDto = {
        id: x.id,
        name: x.name,
        parent_id: x.product_type_parent_id ?? 0,
      };
      return t;
    });
    return res;
  }

  @Get('get-all-product-type-aech-level')
  async getAllProductTypeEachLevel(@Query('parent_id') parent_id:number): Promise<ProductTypeDto[]> {
    const temp = await this._productTypeService.findEachLevel(parent_id);
    const res = temp.map((x) => {
      const t: ProductTypeDto = {
        id: x.id,
        name: x.name,
        parent_id: x.product_type_parent_id ?? 0,
      };
      return t;
    });
    return res;
  }
}
