import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto, UserDto, UserTokenDto, UserTokenPayload } from '@usaha/api-interfaces';
import { ConfigService } from '@nestjs/config';
import { HashIdService } from '../../../hash-id/hash-id.service';
import { User } from '../../../../typeorm/entities/auth';

@Injectable()
export class UserAuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private _hasherIdService: HashIdService
      ) {}
      async register(candidate: RegisterUserDto): Promise<string>{
        candidate.email = candidate.email.trim().toLowerCase();
        candidate.username = candidate.username.trim().toLowerCase();
        return await this.userService.create(candidate);

      }
      async validateUser(hashed_id:string): Promise<User> {
        const user = await this.userService.findOneByHashedId(hashed_id);
        if(!user){
          throw new UnauthorizedException("Your token has a problem")
        }
        return user;
      }
      async getProfile(idt:string): Promise<UserDto>{
        const user = await this.userService.findOneByHashedId(idt);
          const {
            password, 
            created_at, 
            created_by,
            updated_at,
            updated_by,
            deleted_at,
            deleted_by,
            id,
            ...usertemp
        } = user;
        const userDto: UserDto = {...usertemp,id:idt}

        return userDto;
      }
      async login(identifier: string, password: string):Promise<UserTokenDto|null> {
        identifier = identifier.trim().toLowerCase();
        let user = await this.userService.findOneByEmail(identifier);
        if(!user){
          user = await this.userService.findOneByUsername(identifier);
        }
        if (user) {
          const salted_password = bcrypt.compareSync(password, user.password);
          if(salted_password){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, id,...result } = user;
            const userDto:UserDto = {...result, id:this._hasherIdService.encrypt(id)}
            const payload:UserTokenPayload = { sub: userDto.id };
            return {
              // access_token: this.jwtService.sign(payload, {secret: this.configService.get('JWT_SECRET_KEY',{infer:true})}),
              access_token: await this.jwtService.sign(payload)
            };
          }
        }
        return null;

        
      }
}
