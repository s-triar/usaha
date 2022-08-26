import { ProductGroup } from './product-group.entity';
import { ProductIn } from './product-in.entity';
import { ProductPhoto } from './product-photo.entity';
import { ProductPrice } from './product-price.entity';
import { ProductStock } from './product-stock.entity';
import { ProductType } from './product-type.entity';
import { Product } from './product.entity';
import { ShopAddress } from './shop-address.entity';
import { ShopPhoto } from './shop-photo.entity';
import { ShopType } from './shop-type.entity';
import { Shop } from './shop.entity';

export const application_entities = [
  Shop,
  ShopAddress,
  ShopType,
  ShopPhoto,
  Product,
  ProductType,
  ProductGroup,
  ProductIn,
  ProductPrice,
  ProductStock,
  ProductPhoto,
  //   Shop Discount
  //   Product Discount,
  //   Product Group Discount
];

export {
  Shop,
  ShopAddress,
  ShopType,
  Product,
  ProductType,
  ProductGroup,
  ProductIn,
  ProductPrice,
  ProductStock,
  ProductPhoto,
};
