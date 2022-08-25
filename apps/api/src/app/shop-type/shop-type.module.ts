import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopType } from '../../typeorm/entities/application';
import { ShopTypeSeederService } from './shop-type-seeder.service';
import { ShopTypeController } from './shop-type.controller';
import { ShopTypeService } from './shop-type.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([ShopType]),
  ],
  controllers: [ShopTypeController],
  providers: [ShopTypeService, ShopTypeSeederService],
  exports:[ShopTypeService]
})
export class ShopTypeModule {
  constructor(private readonly shopTypeSeeder: ShopTypeSeederService){
    console.log("User Module");
    
    this.shopTypeSeeder.seedShopType();
  }
}
