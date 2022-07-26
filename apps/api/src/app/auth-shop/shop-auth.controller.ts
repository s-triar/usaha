import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ShopTokenDto } from '@usaha/api-interfaces';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ShopAuthService } from '../auth-shop/shop-auth.service';
import { AuthUserGuard } from '../auth-user/auth-user.guard';

@Controller('shop-auth')
export class ShopAuthController {
  constructor(private _shopAuthService: ShopAuthService) {}
  
  @UseGuards(AuthUserGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body('identifier') identifier: string,
  ): Promise<ShopTokenDto | null> {
    const user = req.user;
    // const user = await this.authService.validateUser(identifier, password);
    // if(user){
    return await this._shopAuthService.login(user,identifier);
    // }
    // return null;
  }
}
