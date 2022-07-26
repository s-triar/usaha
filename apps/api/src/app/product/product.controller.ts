import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Post,
  Body,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  MemberProductGroupDto,
  ProductInfoDto,
  ProductOfMyShopListItemDto,
  RegisterProductDto,
  RegisterProductPhotoDto,
  RequestFindList,
  ResultFindList,
  UpdateProductInfoDto,
} from '@usaha/api-interfaces';
import { AuthUserGuard } from '../auth-user/auth-user.guard';
import { ShopInterceptorInterceptor } from '../shop-interceptor/shop-interceptor.interceptor';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private _productService: ProductService) {}


  @UseGuards(AuthUserGuard)
  @UseInterceptors(ShopInterceptorInterceptor)
  @Get('check-duplicate-barcode/:shop_id')
  async checkDuplicateBarcode(
    @Param('shop_id') shop_id: string,
    @Query('barcode') barcode: string
  ): Promise<boolean> {
    const p= await this._productService.findProductWithBarcode(
      shop_id,
      barcode
    );
    return p ? true: false;
  }

  @UseGuards(AuthUserGuard)
  @UseInterceptors(ShopInterceptorInterceptor)
  @Get('find-my-store-products/:shop_id')
  async findMyStoreProducts(
    @Param('shop_id') shop_id: string,
    @Query() data: RequestFindList
  ): Promise<ResultFindList<ProductOfMyShopListItemDto>> {
    return await this._productService.findProductsFromStore(
      shop_id,
      data.name,
      data.page,
      data.pageSize
    );
  }

  @UseGuards(AuthUserGuard)
  @Get('find-product-in-group/:product_group_id')
  async findProductInGroup(
    @Param('product_group_id') product_group_id: string,
    @Query() data: RequestFindList
  ): Promise<ResultFindList<MemberProductGroupDto>> {
    return await this._productService.findProductInGroup(
      product_group_id,
      data.name,
      data.page,
      data.pageSize
    );
  }

  // TODO create a product
  @UseGuards(AuthUserGuard)
  @UseInterceptors(ShopInterceptorInterceptor)
  @UseInterceptors(FileInterceptor('photo_file',{preservePath:true, storage:diskStorage({
    destination:'./dist/apps/api/assets/uploads/product',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
        cb(null, `product-${uuid()}${extname(file.originalname)}`);
    },
  })}))
  @Post('register-product')
  async registerProduct(
    @Body() data: RegisterProductDto,
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
    const photo_data:RegisterProductPhotoDto={
        path: file.filename,
        product_id:''
    };
    await this._productService.createTransaction(req.user, data, photo_data);
  }
  // TODO read a product
  @UseGuards(AuthUserGuard)
  @UseInterceptors(ShopInterceptorInterceptor)
  @Get('info-product/:shop_id/:product_id')
  async infoProduct(
    @Param('shop_id') shop_id:string,
    @Param('product_id') product_id:string,
    @Request() req
  ): Promise<ProductInfoDto>{
    return await this._productService.findProduct(shop_id,product_id);
  }
  // TODO update a product

  @UseGuards(AuthUserGuard)
  @UseInterceptors(ShopInterceptorInterceptor)
  @UseInterceptors(FileInterceptor('photo_file',{preservePath:true,storage:diskStorage({
    destination:'./dist/apps/api/assets/uploads/product',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
        cb(null, `product-${uuid()}${extname(file.originalname)}`);
    },
  })}))
  @Post('update-product')
  async updateProduct(
    @Body() data: UpdateProductInfoDto,
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
  ):Promise<void>{
    const photo_data:RegisterProductPhotoDto={
      path: file.filename,
      product_id:''
    };
    await this._productService.updateTransaction(req.user, data, photo_data);
  }

  // TODO delete a product

  // TODO create a product in
  // TODO create a product price

  // TODO find product group in my store
  // TODO create a product group
  // TODO read a product group
  // TODO update a product group
  // TODO delete a product group

  // TODO create product stock -> cron job ?? mysql lock
}

