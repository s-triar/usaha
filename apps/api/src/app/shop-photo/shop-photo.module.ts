import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopPhoto } from '../../typeorm/entities/application/shop-photo.entity';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopPhotoController } from './shop-photo.controller';
import { ShopPhotoService } from './shop-photo.service';

@Module({
  imports:[TypeOrmModule.forFeature([ShopPhoto])],
  controllers: [ShopPhotoController],
  providers: [ShopPhotoService, HashIdService],
  exports:[ShopPhotoService]
})
export class ShopPhotoModule {}
