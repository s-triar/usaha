import { Test, TestingModule } from '@nestjs/testing';
import { ShopAddressController } from './shop-address.controller';

describe('ShopAddressController', () => {
  let controller: ShopAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopAddressController],
    }).compile();

    controller = module.get<ShopAddressController>(ShopAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
