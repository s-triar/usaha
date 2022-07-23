import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/entities/auth/User.entity';
import { CurrentUserModule } from '../auth/current-user.module';
import { HashIdService } from '../hash-id/hash-id.service';
// import { BaseEntitySubscriber } from '../base-entity.subscriber';
import { UserController } from './user.controller';
import { UserSeederService } from './user.seeder.service';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    CurrentUserModule
  ],
  controllers: [UserController],
  providers: [UserService, UserSeederService, UserSubscriber, HashIdService],
  exports:[UserService]
})
export class UserModule {
  constructor(private readonly userSeeder: UserSeederService){
    console.log("User Module");
    
    this.userSeeder.seedUser();
  }
}
