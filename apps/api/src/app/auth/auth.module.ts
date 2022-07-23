import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { HashIdService } from '../hash-id/hash-id.service';
import { UserModule } from '../user/user.module';
import { UserAuthController } from './controllers/user-auth/user-auth.controller';
import { CurrentUserModule } from './current-user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserAuthService } from './services/user-auth/user-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    CurrentUserModule,
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: environment.jwtSecretAuth,
      signOptions: { expiresIn: '1d' },
    }),
    
  ],
  controllers: [
    UserAuthController, 
  ],
  providers: [UserAuthService, JwtStrategy, HashIdService],
  exports:[UserAuthService]
})
export class AuthModule {}
