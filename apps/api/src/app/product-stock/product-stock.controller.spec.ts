import { Test, TestingModule } from '@nestjs/testing';
import { ProductStockController } from './product-stock.controller';

describe('ProductStockController', () => {
  let controller: ProductStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductStockController],
    }).compile();

    controller = module.get<ProductStockController>(ProductStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
