import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MemberProductGroupDto,
  ProductInfoDto,
  ProductInfoGroupDto,
  ProductInfoInDto,
  ProductInfoPhotoDto,
  ProductInfoPriceDto,
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
    shop_id: string,
    barcode: string
  ): Promise<Product> {
    const shop_id_int = this._hasher.decrypt(shop_id);    
    return await this._productRepository.findOneBy({
      barcode: barcode,
      shop_id: shop_id_int,
    });
  }

  async findProduct(
    shop_id: string,
    product_id: string
  ): Promise<ProductInfoDto> {
    const shop_id_int = this._hasher.decrypt(shop_id);    
    const product_id_int = this._hasher.decrypt(product_id);    
    const product = await this._productRepository.findOne({
      where:{
        shop_id:shop_id_int,
        id:product_id_int
      },
      relations:[
        'product_type',
        'product_ins',
        'groups',
        'product_photos',
        'product_prices',
        'product_stocks',
        'product_parent'
      ]
    });

    const prod_groups:ProductInfoGroupDto[]=product.groups.map(x=>{
      return {
        id:this._hasher.encrypt(x.id),
        name:x.name,
        shop_id:this._hasher.encrypt(x.shop_id)
      }});
    
    const prod_ins: ProductInfoInDto[]=product.product_ins.map(x=>{
      return {
        id: this._hasher.encrypt(x.id),
        n:x.n,
        created_at:x.created_at,
        price:x.price,
        from:x.from
      }});
    
    const prod_photos: ProductInfoPhotoDto[]=product.product_photos.map(x=>{
      return {
        id:this._hasher.encrypt(x.id),
        url:x.url
      }
    });

    const prod_prices: ProductInfoPriceDto[]=product.product_prices.map(x=>{
      return {
        id:this._hasher.encrypt(x.id),
        is_auto_wholesale_price: x.is_auto_wholesale_price,
        min_wholesale_price: x.min_wholesale_price,
        price:x.price,
        wholesale_price:x.wholesale_price,
        created_at:x.created_at
      }
    });
    const last_stock = product.product_stocks.sort(
      (a,b)=>a.created_at.getTime()-b.created_at.getTime()
    )[product.product_stocks.length-1];
    const prod: ProductInfoDto ={
      barcode:product.barcode,
      shop_id:this._hasher.encrypt(product.shop_id),
      id: this._hasher.encrypt(product.id),
      contain: product.contain,
      description: product.description,
      name:product.name,
      product_parent_barcode:product.product_parent?.barcode ?? null,
      product_type_id:product.product_type_id,
      theshold_stock:product.threshold_stock,
      stock:last_stock.n,
      groups:prod_groups,
      photos:prod_photos,
      prices:prod_prices,
      product_ins:prod_ins
    }
    return prod;
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
      const new_product = await queryRunner.manager.getRepository(Product).save<Product>(candidate);
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
    console.log(name, page, pageSize);
    
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
        skip: ((1*page) - 1) * (1*pageSize),
        take: (1*pageSize),
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
  async findProductInGroup(
    product_group_id: string,
    name: string,
    page: number,
    pageSize: number
  ): Promise<ResultFindList<MemberProductGroupDto>> {
    const product_group_id_int: number =
      this._hasher.decrypt(product_group_id);
    if (!name) {
      name = '';
    }
    const [groups, countGroups] =
      await this._productRepository.findAndCount({
        where: [
          {
            groups:{
              id: product_group_id_int
            },
            name: Like(`%${name}%`)
          },
        ],
        order: {
          name:'ASC'
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['groups'],
      });
    const groupsDto = groups.map((x) => {
        const temp: MemberProductGroupDto={
          barcode:x.barcode,
          id: this._hasher.encrypt(x.id),
          name:x.name
        }
      return temp;
    });
    const result: ResultFindList<MemberProductGroupDto> = {
      count: countGroups,
      items: groupsDto,
    };
    return result;
  }
}
