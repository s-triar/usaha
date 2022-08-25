import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIn } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopModule } from '../shop/shop.module';
import { ProductInController } from './product-in.controller';
import { ProductInService } from './product-in.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([ProductIn]),
    ShopModule
  ],
  controllers: [ProductInController],
  providers: [ProductInService, HashIdService],
  exports:[ProductInService]
})
export class ProductInModule {}
