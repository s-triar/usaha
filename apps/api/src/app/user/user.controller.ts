import { UserService } from './user.service';
import { Controller, Get, Query} from '@nestjs/common';
import { UserDto } from '@usaha/api-interfaces';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){

    }
    @Get('check-email-exist')
    async checkEmailExist(@Query('email') email:string): Promise<boolean> {
      const user = await this.userService.findOneByEmail(email);
      return user !== null;
    }

    @Get('check-username-exist')
    async checkUsernameExist(@Query('username') username:string): Promise<boolean> {
      const user = await this.userService.findOneByUsername(username);
      return user !== null;
    }
    
    @Get('profile-user')
    async getProfileUser(@Query('id') idt:string): Promise<UserDto> {
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

    

}
