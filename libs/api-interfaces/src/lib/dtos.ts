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
  name:string;
  phone:string;
  owned:boolean;
}

export interface MyShopListDto {
  items: MyShopListItemDto[],
  count: number
}

