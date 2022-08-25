import { Module } from '@nestjs/common';
import { ProductPriceService } from './product-price.service';
import { ProductPriceController } from './product-price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPrice } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports:[
    AuthUserModule,  
    TypeOrmModule.forFeature([ProductPrice]),
    ShopModule
  ],
  providers: [ProductPriceService, HashIdService],
  controllers: [ProductPriceController],
  exports:[ProductPriceService]
})
export class ProductPriceModule {}
