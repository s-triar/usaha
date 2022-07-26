import { Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { MyShopListItemDto, RegisterShopDto, RequestFindList, ResultFindList } from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {

    constructor(private _shopService:ShopService){}

    @UseGuards(AuthUserGuard)
    @Get('check-if-shop-code-duplicate')
    async checkIfShopCodeDuplicate(@Query('shop_code') shop_code:string):Promise<boolean>{
        const temp = await this._shopService.findOneWithShopCode(shop_code);
        return temp!==null;
    }
    
    @UseGuards(AuthUserGuard)
    @Post('register-shop')
    async registerShop(@Body() data: RegisterShopDto, @Request() req):Promise<void>{
        const user = req.user;
        await this._shopService.create(user,data);
    }

    @UseGuards(AuthUserGuard)
    @Post('find-my-shops')
    async findMyShops(@Body() data: RequestFindList, @Request() req):Promise<ResultFindList<MyShopListItemDto>>{
        const user = req.user;
        return await this._shopService.findMyShops(user,data.name,data.page, data.pageSize);
    }
}
