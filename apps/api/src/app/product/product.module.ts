import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../typeorm/entities/application';
import { ShopModule } from '../shop/shop.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ProductGroupModule } from '../product-group/product-group.module';
import { ProductInModule } from '../product-in/product-in.module';
import { ProductPriceModule } from '../product-price/product-price.module';
import { ProductStockModule } from '../product-stock/product-stock.module';
import { ProductTypeModule } from '../product-type/product-type.module';
import { ProductPhotoModule } from "../product-photo/product-photo.module";
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.register({
      dest: './assets/uploads/product',
    }),
    AuthUserModule,
    ShopModule,
    ProductGroupModule,
    ProductInModule,
    ProductPriceModule,
    ProductStockModule,
    ProductTypeModule,
    ProductPhotoModule,

    TypeOrmModule.forFeature([
      Product,
      // ProductType,
      // ProductGroup,
      // ProductIn,
      // ProductPrice,
      // ProductStock,
    ]),
  ],
  providers: [ProductService, HashIdService],
  controllers: [ProductController],
  exports:[ProductService]
})
export class ProductModule {}
