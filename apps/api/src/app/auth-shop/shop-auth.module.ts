import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environments/environment';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopAuthController } from './shop-auth.controller';
import { ShopAuthService } from './shop-auth.service';
import { JwtShopStrategy } from './jwt-shop.strategy';
import { PassportModule } from '@nestjs/passport';
import { Shop } from '../../typeorm/entities/application';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [

    TypeOrmModule.forFeature([Shop]),
    
    ConfigModule,
    PassportModule.register({
      defaultStrategy:'jwt-shop',
      property:'shop'
    }),
    JwtModule.register({
      secret: environment.jwtSecretShopAuth,
      signOptions: { expiresIn: '1d'}

    }),
  ],
  controllers: [ShopAuthController],
  providers: [JwtShopStrategy, HashIdService, ShopAuthService],
  exports: [ShopAuthService],
})
export class ShopAuthModule {}
