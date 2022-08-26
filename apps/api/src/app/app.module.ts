import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environments/environment';
import { auth_entities } from '../typeorm/entities/auth';
import { UserModule } from './user/user.module';
import { application_entities } from '../typeorm/entities/application';
import { AuthUserModule } from './auth-user/auth-user.module';
import { ShopModule } from './shop/shop.module';
import { WilayahAdministrativeModule } from './wilayah-administrative/wilayah-administrative.module';
import { wilayah_administrative_entities } from '../typeorm/entities/wilayah';
import { ShopTypeModule } from './shop-type/shop-type.module';
import { ProductModule } from './product/product.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductInModule } from './product-in/product-in.module';
import { ProductPriceModule } from './product-price/product-price.module';
import { ProductGroupModule } from './product-group/product-group.module';
import { ProductStockModule } from './product-stock/product-stock.module';
import { HashIdService } from './hash-id/hash-id.service';
import { ProductPhotoModule } from './product-photo/product-photo.module';
import { ShopAddressModule } from './shop-address/shop-address.module';
import { ShopPhotoModule } from './shop-photo/shop-photo.module';

@Module({
  imports: [
    AuthUserModule,
    // ShopAuthModule,

    UserModule,
    // CurrentUserModule,
    ConfigModule.forRoot({
      envFilePath: environment.production ? '.env.prod' : '.env.dev',
    }),
    TypeOrmModule.forRoot({
      // name:'app_db',
      type: 'mysql',
      host: process.env.MYSQL_DB_APP_HOST,
      port: Number.parseInt(process.env.MYSQL_DB_APP_PORT),
      username: process.env.MYSQL_DB_APP_USERNAME,
      password: process.env.MYSQL_DB_APP_PASSWORD,
      database: process.env.MYSQL_DB_APP_DATABASE,
      entities: [
        ...auth_entities,
        ...application_entities,
        ...wilayah_administrative_entities,
      ],
      // subscribers:[BaseEntitySubscriber],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ShopModule,
    ShopTypeModule,
    WilayahAdministrativeModule,
    ProductModule,
    ProductTypeModule,
    ProductInModule,
    ProductPriceModule,
    ProductGroupModule,
    ProductStockModule,
    ProductPhotoModule,
    ShopAddressModule,
    ShopPhotoModule,
    // TypeOrmModule.forRoot({
    //   name:'auth_db',
    //   type: 'mysql',
    //   host: process.env.MYSQL_DB_AUTH_HOST,
    //   port: Number.parseInt(process.env.MYSQL_DB_AUTH_PORT),
    //   username: process.env.MYSQL_DB_AUTH_USERNAME,
    //   password: process.env.MYSQL_DB_AUTH_PASSWORD,
    //   database: process.env.MYSQL_DB_AUTH_DATABASE,
    //   entities: auth_entities,
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, HashIdService],
})
export class AppModule {}
