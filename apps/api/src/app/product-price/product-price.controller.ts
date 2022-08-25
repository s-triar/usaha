import { Controller, Post, UseGuards, UseInterceptors, Request, Body } from '@nestjs/common';
import { RegisterProductPriceDto } from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ProductPriceService } from './product-price.service';

@Controller('product-price')
export class ProductPriceController {
    constructor(
        private _productPriceService: ProductPriceService
    ){}

    @UseGuards(AuthUserGuard)
    @UseInterceptors(ShopInterceptorInterceptor)
    @Post('register-product-price')
    async registerProductPrice(@Body() data: RegisterProductPriceDto, @Request() req):Promise<void>{
        await this._productPriceService.create(req.user,data);
    }
}
