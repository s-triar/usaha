import { Injectable } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import {readFileSync} from 'fs';
import {parse} from 'papaparse';
import { Any } from 'typeorm';

@Injectable()
export class ProductTypeSeederService {

    // private path_file_seed = 'GoodsTypesSeed copy.json';
    private path_file_seed = 'product-type-seeds.csv';

    constructor(private _productTypeService:ProductTypeService){}

    async seedProductType():Promise<void>{
        console.log("Seed proudct type");

        const data = await this._productTypeService.findAll();
        if(data.length===0){
            const dataProductType = readFileSync(this.path_file_seed,'utf8');
            const dataProductTypeData = dataProductType.toString();
            
            const parsedProductType = await parse(dataProductTypeData, {
                header:false,
                skipEmptyLines:true,
                complete: (results)=>results.data
            });
            // console.log(parsedProductType);
            
            for(let i =0; i<parsedProductType.data.length;i++){
                const id = parseInt(parsedProductType.data[i][0].toString().trim().toUpperCase());
                const name = parsedProductType.data[i][1].toString().trim().toUpperCase();
                const parent_id = parseInt(parsedProductType.data[i][2].toString().trim().toUpperCase());
                await this._productTypeService.create(id,name,parent_id === 0 ? null : parent_id);
            }
        }

        
    }

}
