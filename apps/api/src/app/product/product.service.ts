import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProductOfMyShopListItemDto,
  RegisterProductDto,
  RegisterProductInDto,
  RegisterProductPhotoDto,
  RegisterProductPriceDto,
  RegisterProductStockDto,
  ResultFindList,
  UserLoggedIn,
} from '@usaha/api-interfaces';
import { DataSource, Like, Repository } from 'typeorm';
import { Product } from '../../typeorm/entities/application';
import { HashIdService } from '../hash-id/hash-id.service';
import { ProductGroupService } from '../product-group/product-group.service';
import { ProductInService } from '../product-in/product-in.service';
import { ProductPhotoService } from '../product-photo/product-photo.service';
import { ProductPriceService } from '../product-price/product-price.service';
import { ProductStockService } from '../product-stock/product-stock.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _productRepository: Repository<Product>,
    private _dataSource: DataSource,
    private _hasher: HashIdService,
    private _productGroupService: ProductGroupService,
    private _productInService: ProductInService,
    private _productStockService: ProductStockService,
    private _productPriceService: ProductPriceService,
    private _productPhotoService: ProductPhotoService
  ) {}

  async findProductWithBarcode(
    barcode: string,
    shop_id: string
  ): Promise<Product> {
    const shop_id_int = this._hasher.decrypt(shop_id);
    return await this._productRepository.findOneBy({
      barcode: barcode,
      shop_id: shop_id_int,
    });
  }

  async createTransaction(
    userLoggedIn: UserLoggedIn,
    data: RegisterProductDto,
    photo_data: RegisterProductPhotoDto
  ): Promise<void> {
    const parentProduct = await this.findProductWithBarcode(
      data.barcode_parent,
      data.shop_id
    );
    const group_ids = [];
    for (let index = 0; index < data.product_group_ids.length; index++) {
      const element = data.product_group_ids[index];
      group_ids.push(this._hasher.decrypt(element));
    }
    const groups = await this._productGroupService.findGroupWithIds(group_ids);
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error=null;
    try {
      const candidate: Product = {
        id: 0,
        barcode: data.barcode.trim().toLowerCase(),
        name: data.name.trim().toLowerCase(),
        shop_id: this._hasher.decrypt(data.shop_id),
        product_parent_id: parentProduct ? parentProduct.id : null,
        groups: groups,
        contain: data.contain,
        description: data.description,
        threshold_stock: data.threshold_stock,
        product_type_id: data.product_type_id,
        created_at: new Date(),
        created_by_id: userLoggedIn.id,
      };
      const new_product = await queryRunner.manager.save(candidate);
      const new_product_id_str = this._hasher.encrypt(new_product.id);
      // add product in
      const data_product_in: RegisterProductInDto = {
        n: data.current_stock,
        price: data.buy_price,
        product_id: new_product_id_str,
        from: 'init create product',
      };
      await this._productInService.createTransaction(
        userLoggedIn,
        data_product_in,
        queryRunner
      );

      // add product stock
      const data_product_stock: RegisterProductStockDto = {
        product_id: new_product_id_str,
        n: data.current_stock,
        description: 'init create product',
      };
      await this._productStockService.createTransaction(
        userLoggedIn,
        data_product_stock,
        queryRunner
      );

      // add product price
      const data_product_price: RegisterProductPriceDto = {
        product_id: new_product_id_str,
        isAutoUseWholeSale: data.is_auto_use_whole_sale_price,
        minWholeSalePrice: data.min_auto_whole_sale_price,
        price: data.sell_price,
        wholeSalePrice: data.whole_sale_price,
      };
      await this._productPriceService.createTransaction(
        userLoggedIn,
        data_product_price,
        queryRunner
      );

      // add product photo
      if (photo_data) {
        photo_data.product_id = new_product_id_str;
        await this._productPhotoService.createTransaction(
          userLoggedIn,
          photo_data,
          queryRunner
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    if(error){
      throw error;
    }
  }

  async create(
    userLoggedIn: UserLoggedIn,
    data: RegisterProductDto,
    photo_data: RegisterProductPhotoDto
  ): Promise<void> {
    const parentProduct = await this.findProductWithBarcode(
      data.barcode_parent,
      data.shop_id
    );
    const group_ids = [];
    for (let index = 0; index < data.product_group_ids.length; index++) {
      const element = data.product_group_ids[index];
      group_ids.push(this._hasher.decrypt(element));
    }
    const groups = await this._productGroupService.findGroupWithIds(group_ids);
    const candidate: Product = {
      id: 0,
      barcode: data.barcode.trim().toLowerCase(),
      name: data.name.trim().toLowerCase(),
      shop_id: this._hasher.decrypt(data.shop_id),
      product_parent_id: parentProduct ? parentProduct.id : null,
      groups: groups,
      contain: data.contain,
      description: data.description,
      threshold_stock: data.threshold_stock,
      product_type_id: data.product_type_id,
      created_at: new Date(),
      created_by_id: userLoggedIn.id,
    };
    const new_product = await this._productRepository.save(candidate);

    const new_product_id_str = this._hasher.encrypt(new_product.id);
    // add product in
    const data_product_in: RegisterProductInDto = {
      n: data.current_stock,
      price: data.buy_price,
      product_id: new_product_id_str,
      from: 'init create product',
    };
    await this._productInService.create(userLoggedIn, data_product_in);

    // add product stock
    const data_product_stock: RegisterProductStockDto = {
      product_id: new_product_id_str,
      n: data.current_stock,
      description: 'init create product',
    };
    await this._productStockService.create(userLoggedIn, data_product_stock);

    // add product price
    const data_product_price: RegisterProductPriceDto = {
      product_id: new_product_id_str,
      isAutoUseWholeSale: data.is_auto_use_whole_sale_price,
      minWholeSalePrice: data.min_auto_whole_sale_price,
      price: data.sell_price,
      wholeSalePrice: data.whole_sale_price,
    };
    await this._productPriceService.create(userLoggedIn, data_product_price);

    // add product photo
    if (photo_data) {
      photo_data.product_id = new_product_id_str;
      await this._productPhotoService.create(userLoggedIn, photo_data);
    }
  }

  async findProductsFromStore(
    store_id: string,
    name: string | null,
    page: number,
    pageSize: number
  ): Promise<ResultFindList<ProductOfMyShopListItemDto>> {
    if (!name) {
      name = '';
    }
    const store_id_int = this._hasher.decrypt(store_id);
    const [products, countProducts] =
      await this._productRepository.findAndCount({
        where: [
          {
            shop_id: store_id_int,
            name: Like(`%${name}%`),
          },
          {
            shop_id: store_id_int,
            barcode: Like(`%${name}%`),
          },
        ],
        order: {
          name: 'ASC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['product_type', 'product_prices', 'product_stocks'],
      });
    const productsDto = products.map((item) => {
      const productPrice = item.product_prices.pop();
      const temp: ProductOfMyShopListItemDto = {
        id: this._hasher.encrypt(item.id),
        name: item.name,
        barcode: item.barcode,
        price: productPrice.price,
        whole_sale_price: productPrice.wholesale_price,
        shop_id: this._hasher.encrypt(item.shop_id),
        product_type_name: item.product_type.name,
        stock: item.product_stocks.pop().n,
      };
      return temp;
    });
    const result: ResultFindList<ProductOfMyShopListItemDto> = {
      items: productsDto,
      count: countProducts,
    };
    return result;
  }
}
