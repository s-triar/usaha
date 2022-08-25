import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIn, ProductStock } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopModule } from '../shop/shop.module';
import { ProductStockController } from './product-stock.controller';
import { ProductStockService } from './product-stock.service';

@Module({
  imports: [
    AuthUserModule,
    TypeOrmModule.forFeature([ProductStock]),
    ShopModule
  ],
  controllers: [ProductStockController],
  providers: [ProductStockService, HashIdService],
  exports:[ProductStockService]
})
export class ProductStockModule {}
