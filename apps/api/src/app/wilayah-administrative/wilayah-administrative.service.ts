import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District, Province, Regency, Village } from '../../typeorm/entities/wilayah';

@Injectable()
export class WilayahAdministrativeService {
    constructor(
        @InjectRepository(Province) private _provincesRepository: Repository<Province>,
        @InjectRepository(Regency) private _regenciesRepository: Repository<Regency>,
        @InjectRepository(District) private _districtsRepository: Repository<District>,
        @InjectRepository(Village) private _villagesRepository: Repository<Village>,
      ) {
        
      }

    
    async createProvince(id:string, name:string):Promise<string>{
        const candidate: Province ={
            id:id,
            name:name
        };
        const new_province = await this._provincesRepository.save(candidate);
        return new_province.id;
    }
    async createRegency(id:string, name:string, province_id:string):Promise<string>{
        const candidate: Regency ={
            id:id,
            name:name,
            province_id:province_id
        };
        const new_regency = await this._regenciesRepository.save(candidate);
        return new_regency.id;
    }
    async createDistrict(id:string, name:string, regency_id:string):Promise<string>{
        const candidate: District ={
            id:id,
            name:name,
            regency_id:regency_id
        };
        const new_district = await this._districtsRepository.save(candidate);
        return new_district.id;
    }
    async createVillage(id:string, name:string, district_id:string):Promise<string>{
        const candidate: Village ={
            id:id,
            name:name,
            district_id:district_id
        };
        const new_village = await this._villagesRepository.save(candidate);
        return new_village.id;
    }

    findAllProvince():Promise<Province[]>{
        return this._provincesRepository.find({order:{
            name:'ASC'
        }});
    }
    findAllRegencyInProvince(province_id:string):Promise<Regency[]>{
        return this._regenciesRepository.find({where:{province_id:province_id},order:{
            name:'ASC'
        }});
    }
    findAllDistrictInRegency(regency_id:string):Promise<District[]>{
        return this._districtsRepository.find({where:{regency_id:regency_id},order:{
            name:'ASC'
        }});
    }
    findAllVillageInDistrict(district_id:string):Promise<Village[]>{
        return this._villagesRepository.find({where:{district_id:district_id},order:{
            name:'ASC'
        }});
    }
}
