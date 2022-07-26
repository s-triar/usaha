import { Injectable } from '@nestjs/common';
import { WilayahAdministrativeService } from './wilayah-administrative.service';
import {readFileSync} from 'fs';
import {parse} from 'papaparse';

@Injectable()
export class WilayahAdministrativeSeederService {
    // Data from https://github.com/edwardsamuel/Wilayah-Administratif-Indonesia/tree/master/csv
    private path_province ='wilayah-csv/provinces.csv';
    private path_regency ='wilayah-csv/regencies.csv';
    private path_district ='wilayah-csv/districts.csv';
    private path_village ='wilayah-csv/villages.csv';
    constructor(private wilayahService:WilayahAdministrativeService){

    }
    async seedWilayah():Promise<void>{
        console.log("Seed wilayah");
        const provinces = await this.wilayahService.findAllProvince();
        if(provinces.length===0){
            await this.seedProvince();
            await this.seedRegency();
            await this.seedDistrict();
            await this.seedVillage();
            console.log("Seed wilayah selesai");
        }
        
    }

    async seedProvince():Promise<void>{
        console.log("Seed Province");

        const csvProvince = readFileSync(this.path_province);
        const csvProvinceData = csvProvince.toString();
        // console.log(csvProvinceData);
        const parsedProvince = await parse(csvProvinceData, {
            header:false,
            skipEmptyLines:true,
            complete: (results)=>results.data
        });
        for(let i =0; i<parsedProvince.data.length;i++){
            const id = parsedProvince.data[i][0].toString().trim().toUpperCase();
            const name = parsedProvince.data[i][1].toString().trim().toUpperCase();
            await this.wilayahService.createProvince(id,name);
        }
    }
    async seedRegency():Promise<void>{
        console.log("Seed Regency");

        const csvRegency = readFileSync(this.path_regency);
        const csvRegencyData = csvRegency.toString();
        // console.log(csvRegencyData);
        const parsedRegency = await parse(csvRegencyData, {
            header:false,
            skipEmptyLines:true,
            complete: (results)=>results.data
        });
        for(let i =0; i<parsedRegency.data.length;i++){
            const id = parsedRegency.data[i][0].toString().trim().toUpperCase();
            const province_id = parsedRegency.data[i][1].toString().trim().toUpperCase();
            const name = parsedRegency.data[i][2].toString().trim().toUpperCase();
            await this.wilayahService.createRegency(id,name,province_id);
        }
    }
    async seedDistrict():Promise<void>{
        console.log("Seed District");

        const csvDistrict = readFileSync(this.path_district);
        const csvDistrictData = csvDistrict.toString();
        // console.log(csvDistrictData);
        const parsedDistrict = await parse(csvDistrictData, {
            header:false,
            skipEmptyLines:true,
            complete: (results)=>results.data
        });
        for(let i =0; i<parsedDistrict.data.length;i++){
            const id = parsedDistrict.data[i][0].toString().trim().toUpperCase();
            const regency_id = parsedDistrict.data[i][1].toString().trim().toUpperCase();
            const name = parsedDistrict.data[i][2].toString().trim().toUpperCase();
            await this.wilayahService.createDistrict(id,name,regency_id);
        }
    }
    async seedVillage():Promise<void>{
        console.log("Seed Village");

        const csvVillage = readFileSync(this.path_village);
        const csvVillageData = csvVillage.toString();
        // console.log(csvVillageData);
        const parsedVillage = await parse(csvVillageData, {
            header:false,
            skipEmptyLines:true,
            complete: (results)=>results.data
        });
        for(let i =0; i<parsedVillage.data.length;i++){
            const id = parsedVillage.data[i][0].toString().trim().toUpperCase();
            const district_id = parsedVillage.data[i][1].toString().trim().toUpperCase();
            const name = parsedVillage.data[i][2].toString().trim().toUpperCase();
            this.wilayahService.createVillage(id,name,district_id);
        }
    }
}
