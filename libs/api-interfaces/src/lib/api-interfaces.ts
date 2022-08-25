import { BaseDto, UserDto } from './dtos';

export interface Message {
  message: string;
}
export interface UserLoggedIn {
  id: number;
}

export interface ShopLoggedIn {
  id: number;
}

export interface UserDtoWithBaseDto extends UserDto, BaseDto {}

export interface RegisterUserDto {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserDto {
  identifier: string;
  password: string;
}

export interface RegisterShopAddressDto {
  province: string;
  city: string;
  district: string;
  village: string;
  street: string;
  postal_code: string;
  geo_map_location?: string | null;
}

export interface RegisterShopDto {
  shop_code: string;
  name: string;
  shop_type_id:number;
  email?: string;
  photo?: string;
  phone: string;
  address: RegisterShopAddressDto;
}

export interface RequestFindList{
  name:string;
  page:number;
  pageSize:number;
}
export interface RequestFindListShopEntity{
  name:string;
  shop_id:string;
  page:number;
  pageSize:number;
}
export interface RegisterProductGroupDto{
  name:string;
  description:string|null;
  shop_id:string;
}
export interface RegisterProductInDto{
  product_id:string;
  n:number;
  price:number;
  from?:string|null;
}
export interface RegisterProductPriceDto{
  product_id:string;
  wholeSalePrice:number;
  price:number;
  minWholeSalePrice:number;
  isAutoUseWholeSale:boolean;
}

export interface RegisterProductDto{
  shop_id:string;
  barcode:string;
  name:string;
  product_type_id:number;
  product_group_ids:string[];
  buy_price:number;
  sell_price:number;
  whole_sale_price:number;
  is_auto_use_whole_sale_price:boolean;
  min_auto_whole_sale_price:number;
  current_stock:number;
  barcode_parent:string;
  description:string|null;
  threshold_stock:number;
  contain:number;
  photo_string:string|null;
  photo_file:File|null;
  photo:string|null; // file name
}

export interface RegisterProductStockDto{
  product_id:string;
  n:number;
  description?:string|null;
}

export interface RegisterProductPhotoDto{
  product_id:string;
  path:string;
}
export interface RegisterProductPhotoFileDto{
  product_id:string;
  file:File;
}