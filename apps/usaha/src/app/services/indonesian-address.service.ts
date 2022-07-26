import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DistrictDto, ProvinceDto, RegencyDto, VillageDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndonesianAddressService {

  constructor(private http:HttpClient) { }

  
    getAllProvince():Observable<ProvinceDto[]>{
        return this.http.get<ProvinceDto[]>('/api/wilayah-administrative/get-all-province');
    }

    
    getAllRegencyInProvince(province_id:string): Observable<RegencyDto[]>{
      return this.http.get<RegencyDto[]>(`/api/wilayah-administrative/get-all-regency-in-province/${province_id}`);
        
    }
    
    getAllDistrictInRegency(regency_id:string): Observable<DistrictDto[]>{
      return this.http.get<DistrictDto[]>(`/api/wilayah-administrative/get-all-district-in-regency/${regency_id}`);
        
    }
    
    getAllVillageInDistrict(district_id:string): Observable<VillageDto[]>{
      return this.http.get<VillageDto[]>(`/api/wilayah-administrative/get-all-village-in-district/${district_id}`);
        
    }

}
