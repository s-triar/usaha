import { Body, Controller, Get, Post, Query, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { MyShopProductGroupDto, RegisterProductGroupDto, RequestFindList, RequestFindListShopEntity, ResultFindList } from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ProductGroupService } from './product-group.service';

@Controller('product-group')
export class ProductGroupController {

    constructor(
        private _productGroupService:ProductGroupService
    ){

    }

    @UseGuards(AuthUserGuard)
    @UseInterceptors(ShopInterceptorInterceptor)
    @Get('check-if-group-exist')
    async checkIfGroupExist(@Query('name') name:string, @Query('shop_id') shop_id:string):Promise<boolean>{
        const data = await this._productGroupService.findGroupWithName(name, shop_id);
        return data !==null;
    }

    @UseGuards(AuthUserGuard)
    @Get('find-my-shop-product-groups')
    @UseInterceptors(ShopInterceptorInterceptor)
    async findMyShopProductGroups(
        @Query() data: RequestFindListShopEntity,
    ):Promise<ResultFindList<MyShopProductGroupDto>>{
        return await this._productGroupService.findMyStoreProductGroups(data.name,data.shop_id,data.page, data.pageSize);
    }

    @UseGuards(AuthUserGuard)
    @UseInterceptors(ShopInterceptorInterceptor)
    @Post('register-product-group')
    async registerProductGroup(@Body() data: RegisterProductGroupDto, @Request() req):Promise<void>{
        await this._productGroupService.create(data.name, data.shop_id, data.description,req.user);
    }



}
