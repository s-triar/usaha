import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import {
  MyShopListItemDto,
  RegisterShopDto,
  RequestFindList,
  ResultFindList,
  // ShopTokenDto,
} from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
// import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(
    private _shopService: ShopService
  ) {}

  @UseGuards(AuthUserGuard)
  @Post('login')
  async login(
    @Body('identifier') identifier: string,
    @Request() req
  ): Promise<boolean> {
    const user = req.user;
    return await this._shopService.checkAuthorizationShop(user, identifier);
  }

  @UseGuards(AuthUserGuard)
  @Get('check-if-shop-code-duplicate')
  async checkIfShopCodeDuplicate(
    @Query('shop_code') shop_code: string
  ): Promise<boolean> {
    const temp = await this._shopService.findOneWithShopCode(shop_code);
    return temp !== null;
  }

  @UseGuards(AuthUserGuard)
  @Post('register-shop')
  async registerShop(
    @Body() data: RegisterShopDto,
    @Request() req
  ): Promise<void> {
    const user = req.user;
    await this._shopService.create(user, data);
  }

  @UseGuards(AuthUserGuard)
  @Get('find-my-shops')
  async findMyShops(
    @Query() data: RequestFindList,
    @Request() req
  ): Promise<ResultFindList<MyShopListItemDto>> {
    const user = req.user;
    return await this._shopService.findMyShops(
      user,
      data.name,
      data.page,
      data.pageSize
    );
  }

  
}
