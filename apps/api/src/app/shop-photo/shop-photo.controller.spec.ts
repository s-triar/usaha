import { Test, TestingModule } from '@nestjs/testing';
import { ShopPhotoController } from './shop-photo.controller';

describe('ShopPhotoController', () => {
  let controller: ShopPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopPhotoController],
    }).compile();

    controller = module.get<ShopPhotoController>(ShopPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
