import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPhoto } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ProductPhotoController } from './product-photo.controller';
import { ProductPhotoService } from './product-photo.service';

@Module({
  imports:[
    AuthUserModule,
    TypeOrmModule.forFeature([ProductPhoto])
  ],
  controllers: [ProductPhotoController],
  providers: [ProductPhotoService, HashIdService],
  exports:[ProductPhotoService]
})
export class ProductPhotoModule {}
