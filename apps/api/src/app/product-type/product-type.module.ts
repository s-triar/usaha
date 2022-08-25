import { Module } from '@nestjs/common';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductTypeSeederService } from './product-type-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';

@Module({
  imports:[
    AuthUserModule,
    TypeOrmModule.forFeature([ProductType])
  ],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, ProductTypeSeederService],
  exports:[
    ProductTypeService
  ]
})
export class ProductTypeModule {
  constructor(private _productTypeSeeder: ProductTypeSeederService){
    this._productTypeSeeder.seedProductType();
  }
}
