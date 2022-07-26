import { Controller, Get, Param } from '@nestjs/common';
import { DistrictDto, ProvinceDto, RegencyDto, VillageDto } from '@usaha/api-interfaces';
import { WilayahAdministrativeService } from './wilayah-administrative.service';

@Controller('wilayah-administrative')
export class WilayahAdministrativeController {

    constructor(private _wilayahService:WilayahAdministrativeService){}

    @Get('get-all-province')
    async getAllProvince():Promise<ProvinceDto[]>{
        return (await this._wilayahService.findAllProvince()).map(x=>{
            const temp:ProvinceDto={
                id:x.id,
                name:x.name
            };
            return temp;
        });
    }

    @Get('get-all-regency-in-province/:province_id')
    async getAllRegencyInProvince(@Param('province_id') province_id:string): Promise<RegencyDto[]>{
        return (await this._wilayahService.findAllRegencyInProvince(province_id)).map(x=>{
            const temp: RegencyDto={
                id:x.id,
                name:x.name,
                province_id:x.province_id
            };
            return temp;
        });
    }

    @Get('get-all-district-in-regency/:regency_id')
    async getAllDistrictInRegency(@Param('regency_id') regency_id:string): Promise<DistrictDto[]>{
        return (await this._wilayahService.findAllDistrictInRegency(regency_id)).map(x=>{
            const temp: DistrictDto={
                id:x.id,
                name:x.name,
                regency_id:x.regency_id
            };
            return temp;
        });
    }
    @Get('get-all-village-in-district/:district_id')
    async getAllVillageInDistrict(@Param('district_id') district_id:string): Promise<VillageDto[]>{
        return (await this._wilayahService.findAllVillageInDistrict(district_id)).map(x=>{
            const temp: VillageDto={
                id:x.id,
                name:x.name,
                district_id:x.district_id
            };
            return temp;
        });
    }

}
