import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthUserController } from './auth-user.controller';
import { JwtModule } from "@nestjs/jwt";
import { environment } from '../../environments/environment';
import { AuthUserService } from './auth-user.service';
import { HashIdService } from '../hash-id/hash-id.service';
import { AuthUserStrategy } from './auth-user.strategy';

@Module({
  imports:[
    // CurrentUserModule,
    UserModule,
    PassportModule.register({
      defaultStrategy:'jwt-user',
      property:'user'
    }),
    ConfigModule,
    JwtModule.register({
      secret: environment.jwtSecretAuth,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthUserController],
  providers:[AuthUserService,HashIdService,AuthUserStrategy],
  exports:[AuthUserService]
})
export class AuthUserModule {}
