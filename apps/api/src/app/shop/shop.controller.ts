import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MyShopListItemDto,
  RegisterShopDto,
  RegisterShopPhotoDto,
  RequestFindList,
  ResultFindList,
  // ShopTokenDto,
} from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
// import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ShopService } from './shop.service';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Express } from 'express';


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
  @UseInterceptors(FileInterceptor('photo_file',{preservePath:true, storage:diskStorage({
    // destination:'./apps/api/src/assets/uploads/shop',
    destination:'./dist/apps/api/assets/uploads/shop',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
        cb(null, `shop-${uuid()}${extname(file.originalname)}`);
    },
  })}))
  @Post('register-shop')
  async registerShop(
    @Body() data: RegisterShopDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'jpeg',
      })
      .addMaxSizeValidator({
        maxSize: 200000
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  )
  file: Express.Multer.File
  ): Promise<void> {
    const photo_data:RegisterShopPhotoDto={
      path: file.filename,
      shop_id:''
    };
    const user = req.user;
    await this._shopService.createTransaction(user, data, photo_data);
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
