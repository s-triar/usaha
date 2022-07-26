export interface BaseDto {
  created_at: Date;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullname: string;
}

export interface UserTokenDto {
  access_token: string;
}
export interface ShopTokenDto {
  shop_access_token: string;
}
export interface UserTokenPayload {
    sub:string;
    exp?:number;
}
export interface ShopTokenPayload {
  sub:string;
  exp?:number;
}

export interface MyShopListItemDto {
  id: string;
  shop_code: string;
  shop_type_name: string;
  name:string;
  phone:string;
  owned:boolean;
}


export interface ResultFindList<T>{
  items: T[],
  count: number
}



export interface ShopTypeDto {
  id:number;
  name:string;
}


export interface ProvinceDto{
  id:string;
  name:string;
}

export interface RegencyDto{
  id:string;
  name:string;
  province_id:string;
}

export interface DistrictDto{
  id:string;
  name:string;
  regency_id:string;
}

export interface VillageDto{
  id:string;
  name:string;
  district_id:string;
}