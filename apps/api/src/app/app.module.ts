import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { environment } from '../environments/environment';
import { auth_entities } from '../typeorm/entities/auth';
import { UserModule } from './user/user.module';
import { CurrentUserModule } from './auth/current-user.module';
import { application_entities } from '../typeorm/entities/application';
import { ShopModule } from './shop/shop.module';
import { PassportModule } from '@nestjs/passport';
// import { ShopAuthModule } from './auth/shop-auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CurrentUserModule,
    ConfigModule.forRoot({envFilePath: environment.production ? '.env.prod':'.env.dev'}),
    TypeOrmModule.forRoot({
      // name:'app_db',
      type: 'mysql',
      host: process.env.MYSQL_DB_APP_HOST,
      port: Number.parseInt(process.env.MYSQL_DB_APP_PORT),
      username: process.env.MYSQL_DB_APP_USERNAME,
      password: process.env.MYSQL_DB_APP_PASSWORD,
      database: process.env.MYSQL_DB_APP_DATABASE,
      entities: [...auth_entities, ...application_entities],
      // subscribers:[BaseEntitySubscriber],
      synchronize: true,
      autoLoadEntities:true
    }),
    ShopModule,
    // ShopAuthModule,
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
  providers: [AppService],
})
export class AppModule {}
