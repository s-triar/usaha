import { Body, Controller, Post, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { RegisterProductStockDto } from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ProductStockService } from './product-stock.service';

@Controller('product-stock')
export class ProductStockController {
    constructor(
        private _productStockService: ProductStockService
    ){}

    @UseGuards(AuthUserGuard)
    @UseInterceptors(ShopInterceptorInterceptor)
    @Post('register-product-stock')
    async registerProductStock(@Body() data: RegisterProductStockDto, @Request() req):Promise<void>{
        await this._productStockService.create(req.user,data);
    }
}
