import { Body, Controller, Post, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { RegisterProductInDto } from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ProductInService } from './product-in.service';

@Controller('product-in')
export class ProductInController {
    constructor(
        private _productInService: ProductInService
    ){}

    @UseGuards(AuthUserGuard)
    @UseInterceptors(ShopInterceptorInterceptor)
    @Post('register-product-in')
    async registerProductIn(@Body() data: RegisterProductInDto, @Request() req):Promise<void>{
        await this._productInService.create(req.user,data);
    }
}
