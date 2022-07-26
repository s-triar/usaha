import { Test, TestingModule } from '@nestjs/testing';
import { ShopTypeController } from './shop-type.controller';

describe('ShopTypeController', () => {
  let controller: ShopTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopTypeController],
    }).compile();

    controller = module.get<ShopTypeController>(ShopTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
