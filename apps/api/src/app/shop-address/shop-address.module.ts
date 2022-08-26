import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopAddress } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopAddressController } from './shop-address.controller';
import { ShopAddressService } from './shop-address.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([ShopAddress])
  ],
  controllers: [ShopAddressController],
  providers:[ShopAddressService, HashIdService],
  exports:[ShopAddressService]
})
export class ShopAddressModule {}
