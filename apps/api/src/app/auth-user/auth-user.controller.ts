import { Body, Controller, Get, Post,Request, UseGuards } from '@nestjs/common';
import { UserDto, UserTokenDto } from '@usaha/api-interfaces';
import { AuthUserGuard } from './auth-user.guard';
import { AuthUserService } from './auth-user.service';

@Controller('auth-user')
export class AuthUserController {
    constructor(private authService: AuthUserService) {}
    
    @Post('login')
    async login(@Body('identifier') identifier:string, @Body('password') password:string):Promise<UserTokenDto|null> {
      // const user = await this.authService.validateUser(identifier, password);
      // if(user){
        return await this.authService.login(identifier, password);
      // }
      // return null;
    }
    
    @UseGuards(AuthUserGuard)
    @Get('my-profile')
    async getProfile(@Request() req):Promise<UserDto> {
      // console.log(req.aaa,"INI AAAA");
      
      const userLoggedIn = req.user;
      const user = await this.authService.getProfile(userLoggedIn.id);
      return user;
    }
    
    @Post('register')
    async register(@Request() req):Promise<void> {      
      await this.authService.register(req.body)
    }
}
