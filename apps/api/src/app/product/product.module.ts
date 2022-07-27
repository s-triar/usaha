import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthUserModule } from '../auth-user/auth-user.module';
import { ShopAuthModule } from '../auth-shop/shop-auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    AuthUserModule,
    ShopAuthModule,

    PassportModule.register({
      defaultStrategy:'jwt-user',
      property:'user'
    }),
    PassportModule.register({
      defaultStrategy:'jwt-shop',
      property:'shop'
    }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
