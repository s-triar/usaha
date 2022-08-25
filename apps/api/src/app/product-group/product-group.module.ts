import { Module } from '@nestjs/common';
import { ProductGroupService } from './product-group.service';
import { ProductGroupController } from './product-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroup } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ProductGroup]),
    AuthUserModule,
    ShopModule
  ],
  providers: [ProductGroupService, HashIdService],
  controllers: [ProductGroupController],
  exports:[
    ProductGroupService
  ]
})
export class ProductGroupModule {}
