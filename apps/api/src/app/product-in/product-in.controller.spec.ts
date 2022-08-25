import { Test, TestingModule } from '@nestjs/testing';
import { ProductInController } from './product-in.controller';

describe('ProductInController', () => {
  let controller: ProductInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInController],
    }).compile();

    controller = module.get<ProductInController>(ProductInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
