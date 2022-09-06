export interface BaseDto {
  created_at: Date;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
}

export interface ResultFindList<T>{
  items: T[],
  count: number
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
  photo:string;
  name:string;
  phone:string;
  owned:boolean;
  address:string;
}
export interface ShopTypeDto {
  id:number;
  name:string;
}
export interface ProductTypeDto {
  id:number;
  name:string;
  parent_id:number;
}
export interface MyShopProductGroupDto{
  id:string;
  name:string;
}
export interface MemberProductGroupDto{
  id:string;
  name:string;
  barcode:string;
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
export interface ProductOfMyShopListItemDto {
  id: string;
  shop_id: string;
  name:string;
  barcode:string;
  product_type_name: string;
  price:number;
  whole_sale_price:number;
  stock:number;
}

export interface ProductInfoGroupDto{
  id:string;
  shop_id:string;
  name:string;
}
export interface ProductInfoInDto{
  id:string;
  n:number;
  price:number;
  from?:string|null;
  created_at:Date;
}
export interface ProductInfoPhotoDto{
  id:string;
  url:string;
}
export interface ProductInfoPriceDto{
  id:string;
  wholesale_price:number;
  price:number;
  is_auto_wholesale_price:boolean;
  min_wholesale_price:number;
  created_at:Date;
}

export interface ProductInfoDto{
  id:string;
  shop_id:string;
  name:string;
  barcode:string;
  description:string;
  contain:number;
  theshold_stock:number;
  product_type_id: number;
  groups:ProductInfoGroupDto[];
  product_ins:ProductInfoInDto[];
  photos:ProductInfoPhotoDto[];
  prices:ProductInfoPriceDto[];
  stock:number;
  product_parent_barcode:string;
}