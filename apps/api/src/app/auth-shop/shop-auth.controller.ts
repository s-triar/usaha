import { Controller } from '@nestjs/common';
// import { ShopTokenDto } from '@usaha/api-interfaces';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// import { ShopAuthService } from '../auth-shop/shop-auth.service';
// import { AuthUserGuard } from '../auth-user/auth-user.guard';

@Controller('shop-auth')
export class ShopAuthController {
  // constructor(private _shopAuthService: ShopAuthService) {}
  
  // @UseGuards(AuthUserGuard)
  // @Post('login')
  // async login(
  //   @Body('identifier') identifier: string,
  //   @Request() req,
  // ): Promise<ShopTokenDto | null> {
  //   const user = req.user;
  //   console.log(user, identifier);
    
  //   // const user = await this.authService.validateUser(identifier, password);
  //   // if(user){
  //   return await this._shopAuthService.login(user,identifier);
  //   // }
  //   // return null;
  // }
}
