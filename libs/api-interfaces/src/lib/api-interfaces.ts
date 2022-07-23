import { BaseDto, UserDto } from './dtos';

export interface Message {
  message: string;
}
// export interface UserAuthTokenPayload{
//   sub:string;
// }

export interface UserLoggedIn{
  id:number;
}

export interface ShopLoggedIn{
  id:number;
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

// export interface CreateUserDtoWithBaseDto extends RegisterUserDto, BaseDto {
//   id: string;
// }

export interface LoginUserDto{
    identifier:string;
    password:string;
}

export interface RegisterShopDto{
  shop_code:string;
  name:string;
  email?:string;
  photo?:string;
  phone:string;
  address:string;
  location?:string;
}