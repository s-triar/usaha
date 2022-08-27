import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopAddressModule } from '../shop-address/shop-address.module';
import { ShopPhotoModule } from '../shop-photo/shop-photo.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Shop]),
        AuthUserModule,
        MulterModule.register(),
        ShopPhotoModule,
        ShopAddressModule
    ],
    controllers:[
        ShopController
    ],
    providers:[
        ShopService, HashIdService
    ],
    exports:[
        ShopService
    ]

})
export class ShopModule {
    
}
