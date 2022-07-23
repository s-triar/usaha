import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../../typeorm/entities/application';
import { AuthModule } from '../auth/auth.module';
// import { CurrentShopModule } from '../auth/current-shop.module';
import { CurrentUserModule } from '../auth/current-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Shop]),
        AuthModule,
        CurrentUserModule,
        // CurrentShopModule
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
