import { Test, TestingModule } from '@nestjs/testing';
import { ShopAuthController } from './shop-auth.controller';

describe('ShopAuthController', () => {
  let controller: ShopAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopAuthController],
    }).compile();

    controller = module.get<ShopAuthController>(ShopAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
