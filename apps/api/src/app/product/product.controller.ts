import { Controller, Get, UseGuards,Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtShopAuthGuard } from '../auth-shop/jwt-shop-auth.guard';
import { AuthUserGuard } from '../auth-user/auth-user.guard';

@Controller('product')
export class ProductController {
    @UseGuards(AuthUserGuard)
    @UseGuards(JwtShopAuthGuard)
    // @UseGuards(AuthGuard(['jwt-user','jwt-shop']))
    @Get('find-my-store-products')
    findMyStoreProducts(@Request() req):void{
        // console.log(req);
        
        console.log(req.user, req.shop);
    }
}
