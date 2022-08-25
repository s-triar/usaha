import { Test, TestingModule } from '@nestjs/testing';
import { ProductPriceController } from './product-price.controller';

describe('ProductPriceController', () => {
  let controller: ProductPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPriceController],
    }).compile();

    controller = module.get<ProductPriceController>(ProductPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
