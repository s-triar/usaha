import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserTokenDto } from '@usaha/api-interfaces';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserAuthService } from '../../services/user-auth/user-auth.service';

@Controller('user-auth')
export class UserAuthController {

    constructor(private authService: UserAuthService) {}
    
    @Post('login')
    async login(@Body('identifier') identifier:string, @Body('password') password:string):Promise<UserTokenDto|null> {
      // const user = await this.authService.validateUser(identifier, password);
      // if(user){
        return await this.authService.login(identifier, password);
      // }
      // return null;
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('my-profile')
    async getProfile(@Request() req) {
      const userLoggedIn = req.user;
      const user = await this.authService.getProfile(userLoggedIn.id);
      return user;
    }
    
    @Post('register')
    async register(@Request() req) {      
      await this.authService.register(req.body)
    }
    // TODO remove account
    // TODO update profile
}
