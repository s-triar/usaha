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
  name:string|null;
  page:number;
  pageSize:number;
}
