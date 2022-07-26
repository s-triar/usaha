import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environments/environment';
import { HashIdService } from '../hash-id/hash-id.service';
import { ShopAuthController } from './shop-auth.controller';
import { ShopAuthService } from './shop-auth.service';
import { ShopModule } from '../shop/shop.module';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { JwtShopStrategy } from './jwt-shop.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthUserModule,
    ShopModule,
    ConfigModule,
    PassportModule.register({
      property:'shop',
      defaultStrategy:'jwt-shop',
      session:false
    }),
    JwtModule.register({
      secret: environment.jwtSecretShopAuth,
      signOptions: { expiresIn: '1d'}

    }),
  ],
  controllers: [ShopAuthController],
  providers: [JwtShopStrategy, HashIdService, ShopAuthService],
  // exports: [ShopAuthService],
})
export class ShopAuthModule {}
