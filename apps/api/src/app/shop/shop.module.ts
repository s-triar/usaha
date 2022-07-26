import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop, ShopAddress } from '../../typeorm/entities/application';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Shop, ShopAddress]),
        AuthUserModule,
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
